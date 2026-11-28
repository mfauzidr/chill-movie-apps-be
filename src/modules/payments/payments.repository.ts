import type { Knex } from "knex";
import db from "../../shared/config/knex";
import { IPayment, IPaymentUpdateBody } from "./payments.model";

const paymentSelect = `
  SELECT
    p.id,
    p.uuid,
    p.order_uuid,
    o.total_amount AS amount,
    p.payment_method,
    p.payment_code,
    p.status,
    p.expired_at,
    p.paid_at,
    p.created_at,
    p.updated_at
  FROM payments p
  INNER JOIN orders o ON o.uuid = p.order_uuid
`;

export const findAll = async (): Promise<IPayment[]> => {
  const [rows] = await db.raw(`${paymentSelect} ORDER BY p.id`);
  return rows as IPayment[];
};

export const findById = async (id: number): Promise<IPayment[]> => {
  const [rows] = await db.raw(`${paymentSelect} WHERE p.id = ?`, [id]);
  return rows as IPayment[];
};

export const findByOrderUuid = async (order_uuid: string): Promise<IPayment[]> => {
  const [rows] = await db.raw(`${paymentSelect} WHERE p.order_uuid = ?`, [order_uuid]);
  return rows as IPayment[];
};

export const insertForOrder = async (
  trx: Knex.Transaction,
  order_uuid: string,
  payment_method: string,
): Promise<void> => {
  await trx.raw(
    "INSERT INTO payments (order_uuid, payment_method) VALUES (?, ?)",
    [order_uuid, payment_method],
  );
};

export const update = async (
  id: number,
  data: IPaymentUpdateBody,
): Promise<IPayment[]> => {
  await db.raw(
    "UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?",
    [data.status, id],
  );
  return findById(id);
};
