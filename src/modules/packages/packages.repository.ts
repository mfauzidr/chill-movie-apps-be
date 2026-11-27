import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import { IPackage, IPackageBody, IPackageUpdateBody } from "./packages.model";

type QueryValue = string | number;

const packageColumns = `
  id,
  uuid,
  name,
  price,
  benefits,
  tnc,
  is_active,
  created_at,
  updated_at
`;

export const findAll = async (): Promise<IPackage[]> => {
  const [rows] = await db.raw(`SELECT ${packageColumns} FROM packages`);
  return rows as IPackage[];
};

export const findById = async (id: number): Promise<IPackage[]> => {
  const [rows] = await db.raw(
    `SELECT ${packageColumns} FROM packages WHERE id = ?`,
    [id],
  );
  return rows as IPackage[];
};

export const insert = async (data: IPackageBody): Promise<IPackage[]> => {
  const [result] = await db.raw(
    `INSERT INTO packages (name, price, benefits, tnc) VALUES (?, ?, ?, ?)`,
    [data.name, data.price, data.benefits, data.tnc],
  );
  const { insertId } = result as ResultSetHeader;
  return findById(insertId);
};

export const update = async (
  id: number,
  data: IPackageUpdateBody,
): Promise<IPackage[]> => {
  const allowedColumns: (keyof IPackageUpdateBody)[] = [
    "name",
    "price",
    "benefits",
    "tnc",
  ];
  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IPackageUpdateBody)) continue;
    columns.push(`\`${key}\` = ?`);
    values.push(value as QueryValue);
  }

  if (columns.length === 0) return [];

  await db.raw(
    `UPDATE packages SET ${columns.join(", ")}, updated_at = NOW() WHERE id = ?`,
    [...values, id],
  );
  return findById(id);
};

export const setActive = async (
  id: number,
  isActive: boolean,
): Promise<IPackage[]> => {
  await db.raw(
    "UPDATE packages SET is_active = ?, updated_at = NOW() WHERE id = ?",
    [isActive, id],
  );
  return findById(id);
};
