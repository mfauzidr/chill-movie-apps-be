import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import { IGenre, IGenreBody } from "./genres.model";

type QueryValue = string | number | Date | boolean | null;

export const findAll = async (): Promise<IGenre[]> => {
  const query = `SELECT id, name, created_at, updated_at FROM genres`;

  const [rows] = await db.raw(query);

  return rows as IGenre[];
};

export const findById = async (id: number): Promise<IGenre[]> => {
  const values = [id];

  const query = `
    SELECT id, name, created_at, updated_at
    FROM genres
    WHERE id = ?
    `;

  const [rows] = await db.raw(query, values);

  return rows as IGenre[];
};

export const insert = async (data: IGenreBody): Promise<IGenre[]> => {
  const allowedColumns: (keyof IGenreBody)[] = ["name"];

  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IGenreBody)) {
      continue;
    }

    columns.push(`\`${key}\``);
    values.push(value);
  }

  if (columns.length === 0) {
    throw new Error("No valid fields provided for insert");
  }

  const placeholders = values.map(() => "?").join(", ");

  const insertQuery = `
    INSERT INTO genres (${columns.join(", ")})
    VALUES (${placeholders})
  `;
  const [results] = await db.raw(insertQuery, values);

  const { insertId } = results as ResultSetHeader;

  const selectQuery = `
    SELECT id, name, created_at, updated_at
    FROM genres
    WHERE id = ?
  `;

  const [rows] = await db.raw(selectQuery, [insertId]);

  return rows as IGenre[];
};

export const update = async (
  id: number,
  data: IGenreBody,
): Promise<IGenre[]> => {
  const allowedColumns: (keyof IGenreBody)[] = ["name"];

  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IGenreBody)) {
      continue;
    }

    values.push(value);
    columns.push(`\`${key}\` = ?`);
  }

  if (columns.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const updateQuery = `
      UPDATE genres
      SET
        ${columns.join(", ")},
        updated_at = NOW()
      WHERE id = ?
    `;

  values.push(id);

  await db.raw(updateQuery, values);

  const selectQuery = `
    SELECT id, name, created_at, updated_at
    FROM genres
    WHERE id = ?
  `;

  const [rows] = await db.raw(selectQuery, [id]);

  return rows as IGenre[];
};

export const deleteGenre = async (id: number): Promise<number> => {
  const query = `
    DELETE FROM genres
    WHERE id = ?
  `;

  const [result] = await db.raw(query, [id]);
  const { affectedRows } = result as ResultSetHeader;

  return affectedRows;
};

export const findExistingGenre = async (
  name: string,
  excludedId?: number,
): Promise<IGenre[]> => {
  const values: QueryValue[] = [name];

  let query = `
    SELECT
      id,
      name
    FROM genres
    WHERE name = ?
  `;

  if (excludedId) {
    query += ` AND id != ?`;
    values.push(excludedId);
  }

  query += ` LIMIT 1`;

  const [rows] = await db.raw(query, values);

  return rows as IGenre[];
};
