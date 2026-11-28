import type { Knex } from "knex";
import { ResultSetHeader } from "mysql2";
import db from "../../shared/config/knex";
import * as paymentsRepository from "../payments/payments.repository";
import { IOrder, IOrderCreateBody, IOrderUpdateBody } from "./orders.model";

interface IOrderAmounts {
  package_price: string;
  discount: string;
  admin_fee: string;
  total_amount: string;
}

const orderColumns = `
  id,
  uuid,
  user_uuid,
  package_uuid,
  promo_code,
  package_price,
  discount,
  admin_fee,
  total_amount,
  status,
  created_at,
  updated_at
`;

export const findAll = async (): Promise<IOrder[]> => {
  const [rows] = await db.raw(`SELECT ${orderColumns} FROM orders ORDER BY id`);
  return rows as IOrder[];
};

export const findById = async (id: number): Promise<IOrder[]> => {
  const [rows] = await db.raw(
    `SELECT ${orderColumns} FROM orders WHERE id = ?`,
    [id],
  );
  return rows as IOrder[];
};

export const findByUserUuid = async (user_uuid: string): Promise<IOrder[]> => {
  const [rows] = await db.raw(
    `SELECT ${orderColumns} FROM orders WHERE user_uuid = ? ORDER BY created_at DESC, id DESC`,
    [user_uuid],
  );
  return rows as IOrder[];
};

export const findPackagePrice = async (
  packageUuid: string,
): Promise<string | null> => {
  const [rows] = await db.raw(
    "SELECT price FROM packages WHERE uuid = ? LIMIT 1",
    [packageUuid],
  );
  const row = (rows as { price: string | number }[])[0];
  return row === undefined ? null : String(row.price);
};

export const insert = async (
  user_uuid: string,
  data: IOrderCreateBody,
  amounts: IOrderAmounts,
): Promise<IOrder[]> => {
  return db.transaction(async (trx) => {
    const [result] = await trx.raw(
      `INSERT INTO orders (
        user_uuid,
        package_uuid,
        promo_code,
        package_price,
        discount,
        admin_fee,
        total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user_uuid,
        data.package_uuid,
        data.promo_code ?? null,
        amounts.package_price,
        amounts.discount,
        amounts.admin_fee,
        amounts.total_amount,
      ],
    );
    const { insertId } = result as ResultSetHeader;

    const [orderRows] = await trx.raw("SELECT uuid FROM orders WHERE id = ?", [
      insertId,
    ]);
    const orderUuid = (orderRows as Array<{ uuid: string }>)[0]?.uuid;
    if (!orderUuid) {
      throw new Error("Created order UUID could not be retrieved");
    }

    await paymentsRepository.insertForOrder(
      trx,
      orderUuid,
      data.payment_method,
    );

    const [rows] = await trx.raw(
      `SELECT ${orderColumns} FROM orders WHERE id = ?`,
      [insertId],
    );
    return rows as IOrder[];
  });
};

export const update = async (
  id: number,
  data: IOrderUpdateBody,
): Promise<IOrder[]> => {
  await db.raw(
    "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
    [data.status, id],
  );
  return findById(id);
};
