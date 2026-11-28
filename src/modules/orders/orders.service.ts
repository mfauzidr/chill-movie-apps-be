import { AppError } from "../../shared/helper/appError";
import { codePointLength } from "../../shared/helper/textValidation";
import {
  IOrderCreateBody,
  IOrderStatus,
  IOrderUpdateBody,
} from "./orders.model";
import * as ordersRepository from "./orders.repository";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const allowedCreateFields = ["package_uuid", "payment_method", "promo_code"];
const orderStatuses: IOrderStatus[] = ["pending", "completed", "cancelled"];

const validateObjectBody = (body: unknown): Record<string, unknown> => {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError(
      "INVALID_BODY",
      "Request body must be a valid object",
      400,
    );
  }
  return body as Record<string, unknown>;
};

const validateUuid = (value: unknown, field: string): string => {
  if (typeof value !== "string" || !uuidPattern.test(value.trim())) {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `${field} must be a valid UUID`,
      400,
    );
  }
  return value.trim();
};

const validatePromoCode = (value: unknown): string | null | undefined => {
  if (value === undefined || value === null) return value;
  if (typeof value !== "string" || codePointLength(value) > 50) {
    throw new AppError(
      "INVALID_PROMO_CODE",
      "promo_code must be a string of at most 50 characters or null",
      400,
    );
  }
  return value;
};

const validatePaymentMethod = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new AppError(
      "INVALID_PAYMENT_METHOD",
      "payment_method must be a non-empty string of at most 50 characters",
      400,
    );
  }

  const normalized = value.trim();
  if (!normalized || codePointLength(normalized) > 50) {
    throw new AppError(
      "INVALID_PAYMENT_METHOD",
      "payment_method must be a non-empty string of at most 50 characters",
      400,
    );
  }
  return normalized;
};

const validateUpdate = (body: unknown): IOrderUpdateBody => {
  const data = validateObjectBody(body);
  const invalidFields = Object.keys(data).filter((field) => field !== "status");
  if (invalidFields.length > 0) {
    throw new AppError(
      "INVALID_FIELD",
      `Invalid fields: ${invalidFields.join(", ")}`,
      400,
    );
  }
  if (
    typeof data.status !== "string" ||
    !orderStatuses.includes(data.status as IOrderStatus)
  ) {
    throw new AppError(
      "INVALID_STATUS",
      "status must be pending, completed, or cancelled",
      400,
    );
  }
  return { status: data.status as IOrderStatus };
};

const decimalToCents = (value: string): bigint => {
  const normalized = value.trim();
  const match = /^(\d{1,10})(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) {
    throw new AppError(
      "INVALID_PACKAGE_PRICE",
      "Package price must be a valid DECIMAL(12,2) value",
      400,
    );
  }

  const whole = BigInt(match[1] ?? "0");
  const fractional = BigInt((match[2] ?? "").padEnd(2, "0"));
  return whole * 100n + fractional;
};

const centsToDecimal = (cents: bigint): string =>
  `${cents / 100n}.${(cents % 100n).toString().padStart(2, "0")}`;

export const findAll = async () => ordersRepository.findAll();

export const findById = async (id: number) => ordersRepository.findById(id);

export const findByUserUuid = async (user_uuid: string | undefined) =>
  ordersRepository.findByUserUuid(validateUuid(user_uuid, "user_uuid"));

export const update = async (id: number, body: IOrderUpdateBody) =>
  ordersRepository.update(id, validateUpdate(body));

export const insert = async (
  user_uuid: string | undefined,
  body: IOrderCreateBody,
) => {
  const data = validateObjectBody(body);
  const invalidFields = Object.keys(data).filter(
    (field) => !allowedCreateFields.includes(field),
  );
  if (invalidFields.length > 0) {
    throw new AppError(
      "INVALID_FIELD",
      `Invalid fields: ${invalidFields.join(", ")}`,
      400,
    );
  }

  const orderBody: IOrderCreateBody = {
    package_uuid: validateUuid(data.package_uuid, "package_uuid"),
    payment_method: validatePaymentMethod(data.payment_method),
  };
  const promoCode = validatePromoCode(data.promo_code);
  if (promoCode !== undefined) orderBody.promo_code = promoCode;
  const normalizedUserUuid = validateUuid(user_uuid, "user_uuid");

  const packagePrice = await ordersRepository.findPackagePrice(
    orderBody.package_uuid,
  );
  if (packagePrice === null) {
    throw new AppError("NOT_FOUND", "Package Not Found", 404);
  }

  const packagePriceCents = decimalToCents(packagePrice);
  const discountCents = 0n;
  const adminFeeCents = 0n;
  const totalAmountCents = packagePriceCents - discountCents + adminFeeCents;

  return ordersRepository.insert(normalizedUserUuid, orderBody, {
    package_price: centsToDecimal(packagePriceCents),
    discount: centsToDecimal(discountCents),
    admin_fee: centsToDecimal(adminFeeCents),
    total_amount: centsToDecimal(totalAmountCents),
  });
};
