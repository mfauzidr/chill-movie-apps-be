import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import { IMyList } from "./my-lists.model";

interface MyListRow {
  id: number;
  user_uuid: string;
  content_uuid: string;
  created_at: Date;
  joined_content_uuid: string;
  title: string;
  poster: string;
  banner: string;
  content_type: "movie" | "series";
}

const myListSelect = `
  SELECT
    ml.id,
    ml.user_uuid,
    ml.content_uuid,
    ml.created_at,
    c.uuid AS joined_content_uuid,
    c.title,
    c.poster,
    c.banner,
    c.content_type
  FROM my_lists ml
  INNER JOIN contents c ON c.uuid = ml.content_uuid
`;

const mapRows = (rows: MyListRow[]): IMyList[] =>
  rows.map((row) => ({
    id: row.id,
    user_uuid: row.user_uuid,
    content_uuid: row.content_uuid,
    created_at: row.created_at,
    content: {
      uuid: row.joined_content_uuid,
      title: row.title,
      poster: row.poster,
      banner: row.banner,
      content_type: row.content_type,
    },
  }));

export const findByUserUuid = async (userUuid: string): Promise<IMyList[]> => {
  const [rows] = await db.raw(
    `${myListSelect} WHERE ml.user_uuid = ? ORDER BY ml.id`,
    [userUuid],
  );
  return mapRows(rows as MyListRow[]);
};

export const findByUserAndContentUuid = async (
  userUuid: string,
  contentUuid: string,
): Promise<IMyList[]> => {
  const [rows] = await db.raw(
    `${myListSelect} WHERE ml.user_uuid = ? AND ml.content_uuid = ?`,
    [userUuid, contentUuid],
  );
  return mapRows(rows as MyListRow[]);
};

export const insert = async (
  userUuid: string,
  contentUuid: string,
): Promise<IMyList[]> => {
  await db.raw(
    "INSERT INTO my_lists (user_uuid, content_uuid) VALUES (?, ?)",
    [userUuid, contentUuid],
  );
  return findByUserAndContentUuid(userUuid, contentUuid);
};

export const deleteByUserAndContentUuid = async (
  userUuid: string,
  contentUuid: string,
): Promise<number> => {
  const [result] = await db.raw(
    "DELETE FROM my_lists WHERE user_uuid = ? AND content_uuid = ?",
    [userUuid, contentUuid],
  );
  const { affectedRows } = result as ResultSetHeader;
  return affectedRows;
};
