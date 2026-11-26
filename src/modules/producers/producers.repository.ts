import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import { IProducer, IProducerBody } from "./producers.model";

type QueryValue = string | number | Date | boolean | null;

export const findAll = async (): Promise<IProducer[]> => {
  const query = `SELECT id, name, created_at, updated_at FROM producers`;
  const [rows] = await db.raw(query);

  return rows as IProducer[];
};

export const findById = async (id: number): Promise<IProducer[]> => {
  const query = `
    SELECT id, name, created_at, updated_at
    FROM producers
    WHERE id = ?
  `;
  const [rows] = await db.raw(query, [id]);

  return rows as IProducer[];
};

export const insert = async (data: IProducerBody): Promise<IProducer[]> => {
  const allowedColumns: (keyof IProducerBody)[] = ["name"];
  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IProducerBody)) {
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
    INSERT INTO producers (${columns.join(", ")})
    VALUES (${placeholders})
  `;
  const [result] = await db.raw(insertQuery, values);
  const { insertId } = result as ResultSetHeader;

  const selectQuery = `
    SELECT id, name, created_at, updated_at
    FROM producers
    WHERE id = ?
  `;
  const [rows] = await db.raw(selectQuery, [insertId]);

  return rows as IProducer[];
};

export const update = async (
  id: number,
  data: IProducerBody,
): Promise<IProducer[]> => {
  const allowedColumns: (keyof IProducerBody)[] = ["name"];
  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IProducerBody)) {
      continue;
    }

    columns.push(`\`${key}\` = ?`);
    values.push(value);
  }

  if (columns.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const updateQuery = `
    UPDATE producers
    SET ${columns.join(", ")}, updated_at = NOW()
    WHERE id = ?
  `;
  values.push(id);
  await db.raw(updateQuery, values);

  const selectQuery = `
    SELECT id, name, created_at, updated_at
    FROM producers
    WHERE id = ?
  `;
  const [rows] = await db.raw(selectQuery, [id]);

  return rows as IProducer[];
};

export const deleteProducer = async (id: number): Promise<number> => {
  const query = `DELETE FROM producers WHERE id = ?`;
  const [result] = await db.raw(query, [id]);
  const { affectedRows } = result as ResultSetHeader;

  return affectedRows;
};

export const findExistingProducer = async (
  name: string,
  excludedId?: number,
): Promise<IProducer[]> => {
  const values: QueryValue[] = [name];
  let query = `
    SELECT id, name
    FROM producers
    WHERE name = ?
  `;

  if (excludedId) {
    query += ` AND id != ?`;
    values.push(excludedId);
  }

  query += ` LIMIT 1`;
  const [rows] = await db.raw(query, values);

  return rows as IProducer[];
};
