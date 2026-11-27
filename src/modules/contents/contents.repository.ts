import type { Knex } from "knex";
import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import {
  IContent,
  IContentCreateBody,
  IContentUpdateBody,
} from "./contents.model";

const contentSelect = `
  SELECT
    c.id,
    c.uuid,
    c.title,
    c.release_date,
    c.synopsis,
    c.age_rating,
    c.poster,
    c.banner,
    c.content_type,
    c.is_premium,
    c.is_active,
    c.created_at,
    c.updated_at,
    COALESCE((
      SELECT JSON_ARRAYAGG(JSON_OBJECT('id', g.id, 'name', g.name))
      FROM content_genres cg
      INNER JOIN genres g ON g.id = cg.genre_id
      WHERE cg.content_uuid = c.uuid
    ), JSON_ARRAY()) AS genres,
    COALESCE((
      SELECT JSON_ARRAYAGG(JSON_OBJECT('id', ca.id, 'name', ca.name))
      FROM content_casts cc
      INNER JOIN casts ca ON ca.id = cc.cast_id
      WHERE cc.content_uuid = c.uuid
    ), JSON_ARRAY()) AS casts,
    COALESCE((
      SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name))
      FROM content_producers cp
      INNER JOIN producers p ON p.id = cp.producer_id
      WHERE cp.content_uuid = c.uuid
    ), JSON_ARRAY()) AS producers
  FROM contents c
`;

type RelationTable = "genres" | "casts" | "producers";
type JunctionTable = "content_genres" | "content_casts" | "content_producers";
type JunctionColumn = "genre_id" | "cast_id" | "producer_id";

export const findAll = async (): Promise<IContent[]> => {
  const [rows] = await db.raw(`${contentSelect} ORDER BY c.id`);
  return rows as IContent[];
};

export const findByUuid = async (uuid: string): Promise<IContent[]> => {
  const [rows] = await db.raw(`${contentSelect} WHERE c.uuid = ?`, [uuid]);
  return rows as IContent[];
};

export const findExistingIds = async (
  table: RelationTable,
  ids: number[],
): Promise<number[]> => {
  if (ids.length === 0) return [];

  const placeholders = ids.map(() => "?").join(", ");
  const [rows] = await db.raw(
    `SELECT id FROM \`${table}\` WHERE id IN (${placeholders})`,
    ids,
  );
  return (rows as Array<{ id: number }>).map((row) => row.id);
};

const insertJunctionRows = async (
  trx: Knex.Transaction,
  table: JunctionTable,
  column: JunctionColumn,
  uuid: string,
  ids: number[],
): Promise<void> => {
  if (ids.length === 0) return;

  const placeholders = ids.map(() => "(?, ?)").join(", ");
  const bindings = ids.flatMap((id) => [uuid, id]);
  await trx.raw(
    `INSERT INTO \`${table}\` (content_uuid, \`${column}\`) VALUES ${placeholders}`,
    bindings,
  );
};

export const insertWithRelations = async (
  data: IContentCreateBody,
): Promise<IContent[]> => {
  return db.transaction(async (trx) => {
    const columns = [
      "title",
      "release_date",
      "synopsis",
      "age_rating",
      "poster",
      "banner",
      "content_type",
    ];
    const values: Array<string | boolean> = [
      data.title,
      data.release_date,
      data.synopsis,
      data.age_rating,
      data.poster,
      data.banner,
      data.content_type,
    ];

    if (data.is_premium !== undefined) {
      columns.push("is_premium");
      values.push(data.is_premium);
    }
    if (data.is_active !== undefined) {
      columns.push("is_active");
      values.push(data.is_active);
    }

    const placeholders = values.map(() => "?").join(", ");
    const [insertResult] = await trx.raw(
      `INSERT INTO contents 
      (${columns.map((column) => `\`${column}\``).join(", ")}) 
      VALUES (${placeholders})`,
      values,
    );
    const { insertId } = insertResult as ResultSetHeader;

    const [contentRows] = await trx.raw(
      "SELECT uuid FROM contents WHERE id = ?",
      [insertId],
    );
    const uuid = (contentRows as Array<{ uuid: string }>)[0]?.uuid;

    if (!uuid) {
      throw new Error("Created content UUID could not be retrieved");
    }

    const genres = data.genre_ids ?? [];
    const casts = data.cast_ids ?? [];
    const producers = data.producer_ids ?? [];

    await insertJunctionRows(trx, "content_genres", "genre_id", uuid, genres);
    await insertJunctionRows(trx, "content_casts", "cast_id", uuid, casts);
    await insertJunctionRows(
      trx,
      "content_producers",
      "producer_id",
      uuid,
      producers,
    );

    const [rows] = await trx.raw(`${contentSelect} WHERE c.uuid = ?`, [uuid]);
    return rows as IContent[];
  });
};

export const update = async (
  uuid: string,
  data: IContentUpdateBody,
): Promise<IContent[]> => {
  const allowedColumns: (keyof IContentUpdateBody)[] = [
    "title",
    "release_date",
    "synopsis",
    "age_rating",
    "poster",
    "banner",
    "content_type",
    "is_premium",
  ];
  const columns: string[] = [];
  const values: Array<string | boolean> = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IContentUpdateBody)) continue;
    columns.push(`\`${key}\` = ?`);
    values.push(value as string | boolean);
  }

  if (columns.length === 0) return [];

  await db.raw(
    `UPDATE contents 
    SET ${columns.join(", ")}, 
    updated_at = NOW() 
    WHERE uuid = ?`,
    [...values, uuid],
  );

  return findByUuid(uuid);
};

export const setActive = async (
  uuid: string,
  isActive: boolean,
): Promise<IContent[]> => {
  await db.raw(
    "UPDATE contents SET is_active = ?, updated_at = NOW() WHERE uuid = ?",
    [isActive, uuid],
  );
  return findByUuid(uuid);
};
