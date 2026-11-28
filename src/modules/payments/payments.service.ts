import { AppError } from "../../shared/helper/appError";
import { IPaymentStatus, IPaymentUpdateBody } from "./payments.model";
import * as paymentsRepository from "./payments.repository";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const paymentStatuses: IPaymentStatus[] = ["pending", "paid", "expired", "failed"];

const validateUuid = (value: unknown, field: string): string => {
  if (typeof value !== "string" || !uuidPattern.test(value.trim())) {
    throw new AppError(`INVALID_${field.toUpperCase()}`, `${field} must be a valid UUID`, 400);
  }
  return value.trim();
};

const validateUpdate = (body: unknown): IPaymentUpdateBody => {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("INVALID_BODY", "Request body must be a valid object", 400);
  }

  const data = body as Record<string, unknown>;
  const invalidFields = Object.keys(data).filter((field) => field !== "status");
  if (invalidFields.length > 0) {
    throw new AppError("INVALID_FIELD", `Invalid fields: ${invalidFields.join(", ")}`, 400);
  }
  if (typeof data.status !== "string" || !paymentStatuses.includes(data.status as IPaymentStatus)) {
    throw new AppError("INVALID_STATUS", "status must be pending, paid, expired, or failed", 400);
  }

  return { status: data.status as IPaymentStatus };
};

export const findAll = async () => paymentsRepository.findAll();

export const findById = async (id: number) => paymentsRepository.findById(id);

export const findByOrderUuid = async (order_uuid: string) =>
  paymentsRepository.findByOrderUuid(validateUuid(order_uuid, "order_uuid"));

export const update = async (id: number, body: IPaymentUpdateBody) =>
  paymentsRepository.update(id, validateUpdate(body));
