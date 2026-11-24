import db from "../../shared/config/knex";
import { ResultSetHeader } from "mysql2";
import { IUser, IUserBody } from "./users.model";

type QueryValue = string | number | Date | boolean | null;

export const findAll = async (): Promise<Omit<IUser, "password">[]> => {
  const query = `
        SELECT
            id,
            uuid,
            username,
            email,
            role,
            image,
            is_active,
            created_at,
            updated_at
        FROM users
    `;

  const [rows] = await db.raw(query);

  return rows;
};

export const findByUuid = async (
  uuid: string,
): Promise<Omit<IUser, "password">[]> => {
  const values = [uuid];
  const query = `
        SELECT
            id,
            uuid,
            username,
            email,
            role,
            image,
            is_active,
            created_at,
            updated_at
        FROM users
        WHERE uuid = ?
    `;

  const [rows] = await db.raw(query, values);

  return rows[0] as Omit<IUser, "password">[];
};

export const insert = async (
  data: IUserBody,
): Promise<Omit<IUser, "password">[]> => {
  const allowedColumns: (keyof IUserBody)[] = [
    "username",
    "email",
    "password",
    "role",
    "image",
    "is_active",
  ];

  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IUserBody)) {
      continue;
    }

    columns.push(`\`${key}\``);
    values.push(value);
  }

  const placeholders = values.map(() => "?").join(", ");

  const insertQuery = `
    INSERT INTO users (${columns.join(", ")})
    VALUES (${placeholders})
  `;

  const [result] = await db.raw(insertQuery, values);
  const { insertId } = result as ResultSetHeader;

  const selectQuery = `
    SELECT
      id,
      uuid,
      username,
      email,
      role,
      image,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
  `;

  const [rows] = await db.raw(selectQuery, [insertId]);

  const users = rows as Omit<IUser, "password">[];

  if (users.length < 1) {
    throw new Error("Failed to retrieve inserted user");
  }

  return users;
};


export const update = async (
  uuid: string,
  data: Partial<IUserBody>,
): Promise<Omit<IUser, "password">[]> => {
  const allowedColumns: (keyof IUserBody)[] = [
    "username",
    "email",
    "password",
    "role",
    "image",
    "is_active",
  ];

  const columns: string[] = [];
  const values: QueryValue[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedColumns.includes(key as keyof IUserBody)) {
      continue;
    }

    values.push(value);
    columns.push(`\`${key}\` = ?`);
  }

  if (columns.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const updateQuery = `
    UPDATE users
    SET
      ${columns.join(", ")},
      updated_at = NOW()
    WHERE uuid = ?
  `;

  values.push(uuid);

  await db.raw(updateQuery, values);

  const selectQuery = `
    SELECT
      id,
      uuid,
      username,
      email,
      role,
      image,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE uuid = ?
  `;

  const [rows] = await db.raw(selectQuery, [uuid]);

  const users = rows as Omit<IUser, "password">[];

  if (users.length === 0) {
    throw new Error("User not found");
  }

  return users;
};

export const deleteUser = async (uuid: string): Promise<number> => {
  const query = `
    DELETE FROM users
    WHERE uuid = ?
  `;

  const [result] = await db.raw(query, [uuid]);
  const { affectedRows } = result as ResultSetHeader;

  return affectedRows;
};

export const findExsistingEmail = async (
  email: string,
  excludeUuid?: string,
): Promise<Omit<IUser, "password">[]> => {
  const values: QueryValue[] = [email];

  let query = `
    SELECT
      id,
      uuid,
      email
    FROM users
    WHERE email = ?
  `;

  if (excludeUuid) {
    query += ` AND uuid != ?`;
    values.push(excludeUuid);
  }

  query += ` LIMIT 1`;

  const [rows] = await db.raw(query, values);

  return rows as Omit<IUser, "password">[];
};