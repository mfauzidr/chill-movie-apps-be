import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import {
  IUserPackage,
  IUserPackageCreateBody,
  IUserPackageUpdateBody,
} from "./user-packages.model";

type QueryValue = string | number;

interface IUserPackageDateRange {
  start_date: string;
  end_date: string;
}

interface IUserPackageRow extends Omit<IUserPackage, "package"> {
  joined_package_uuid: string;
  package_name: string;
  package_price: number;
}

const userPackageSelect = `
  SELECT
    up.id,
    up.user_uuid,
    up.package_uuid,
    up.start_date,
    up.end_date,
    up.status,
    up.created_at,
    up.updated_at,
    p.uuid AS joined_package_uuid,
    p.name AS package_name,
    p.price AS package_price
  FROM user_packages up
  INNER JOIN packages p ON p.uuid = up.package_uuid
`;

const mapRows = (rows: IUserPackageRow[]): IUserPackage[] =>
  rows.map((row) => ({
    id: row.id,
    user_uuid: row.user_uuid,
    package_uuid: row.package_uuid,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    package: {
      uuid: row.joined_package_uuid,
      name: row.package_name,
      price: row.package_price,
    },
  }));

export const findAll = async (): Promise<IUserPackage[]> => {
  const [rows] = await db.raw(`${userPackageSelect} ORDER BY up.id`);
  return mapRows(rows as IUserPackageRow[]);
};

export const findById = async (id: number): Promise<IUserPackage[]> => {
  const [rows] = await db.raw(`${userPackageSelect} WHERE up.id = ?`, [id]);
  return mapRows(rows as IUserPackageRow[]);
};

export const findByUserUuid = async (user_uuid: string): Promise<IUserPackage[]> => {
  const [rows] = await db.raw(
    `${userPackageSelect} WHERE up.user_uuid = ? ORDER BY up.id`,
    [user_uuid],
  );
  return mapRows(rows as IUserPackageRow[]);
};

export const findDatesById = async (id: number): Promise<IUserPackageDateRange | null> => {
  const [rows] = await db.raw(
    "SELECT start_date, end_date FROM user_packages WHERE id = ?",
    [id],
  );
  return (rows as IUserPackageDateRange[])[0] ?? null;
};

export const insert = async (
  user_uuid: string,
  data: IUserPackageCreateBody,
): Promise<IUserPackage[]> => {
  const [result] = await db.raw(
    `INSERT INTO user_packages (user_uuid, package_uuid, start_date, end_date, status)
     VALUES (?, ?, ?, ?, ?)`,
    [user_uuid, data.package_uuid, data.start_date, data.end_date, data.status],
  );
  const { insertId } = result as ResultSetHeader;
  return findById(insertId);
};

export const update = async (
  id: number,
  data: IUserPackageUpdateBody,
): Promise<IUserPackage[]> => {
  const allowedColumns: (keyof IUserPackageUpdateBody)[] = [
    "start_date",
    "end_date",
    "status",
  ];
  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IUserPackageUpdateBody)) continue;
    columns.push(`\`${key}\` = ?`);
    values.push(value as QueryValue);
  }

  if (columns.length === 0) return [];

  await db.raw(
    `UPDATE user_packages SET ${columns.join(", ")}, updated_at = NOW() WHERE id = ?`,
    [...values, id],
  );
  return findById(id);
};
