import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import { ICast, ICastBody } from "./casts.model";

type QueryValue = string | number | Date | boolean | null;

export const findAll = async (): Promise<ICast[]> => {
  const query = `SELECT id, name, created_at, updated_at FROM casts`;
  const [rows] = await db.raw(query);

  return rows as ICast[];
};

export const findById = async (id: number): Promise<ICast[]> => {
  const query = `
    SELECT id, name, created_at, updated_at
    FROM casts
    WHERE id = ?
  `;
  const [rows] = await db.raw(query, [id]);

  return rows as ICast[];
};

export const insert = async (data: ICastBody): Promise<ICast[]> => {
  const allowedColumns: (keyof ICastBody)[] = ["name"];
  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof ICastBody)) {
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
    INSERT INTO casts (${columns.join(", ")})
    VALUES (${placeholders})
  `;
  const [result] = await db.raw(insertQuery, values);
  const { insertId } = result as ResultSetHeader;

  const selectQuery = `
    SELECT id, name, created_at, updated_at
    FROM casts
    WHERE id = ?
  `;
  const [rows] = await db.raw(selectQuery, [insertId]);

  return rows as ICast[];
};

export const update = async (
  id: number,
  data: ICastBody,
): Promise<ICast[]> => {
  const allowedColumns: (keyof ICastBody)[] = ["name"];
  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof ICastBody)) {
      continue;
    }

    columns.push(`\`${key}\` = ?`);
    values.push(value);
  }

  if (columns.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const updateQuery = `
    UPDATE casts
    SET ${columns.join(", ")}, updated_at = NOW()
    WHERE id = ?
  `;
  values.push(id);
  await db.raw(updateQuery, values);

  const selectQuery = `
    SELECT id, name, created_at, updated_at
    FROM casts
    WHERE id = ?
  `;
  const [rows] = await db.raw(selectQuery, [id]);

  return rows as ICast[];
};

export const deleteCast = async (id: number): Promise<number> => {
  const query = `DELETE FROM casts WHERE id = ?`;
  const [result] = await db.raw(query, [id]);
  const { affectedRows } = result as ResultSetHeader;

  return affectedRows;
};
