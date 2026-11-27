import { AppError } from "../../shared/helper/appError";
import { codePointLength } from "../../shared/helper/textValidation";
import { IPackageBody, IPackageUpdateBody } from "./packages.model";
import * as packagesRepository from "./packages.repository";

const allowedFields: (keyof IPackageBody)[] = [
  "name",
  "price",
  "benefits",
  "tnc",
];
const maxPrice = 9999999999.99;

const validateObjectBody = (data: unknown): Record<string, unknown> => {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new AppError("INVALID_BODY", "Request body must be a valid object", 400);
  }
  return data as Record<string, unknown>;
};

const validateAllowedFields = (data: Record<string, unknown>) => {
  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field as keyof IPackageBody),
  );
  if (invalidFields.length > 0) {
    throw new AppError(
      "INVALID_FIELD",
      `Invalid fields: ${invalidFields.join(", ")}`,
      400,
    );
  }
};

const validateString = (
  value: unknown,
  field: "name" | "benefits" | "tnc",
): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `${field} must be a non-empty string`,
      400,
    );
  }

  const normalized = value.trim();
  if (field === "name" && codePointLength(normalized) > 100) {
    throw new AppError("INVALID_NAME", "name must be at most 100 characters", 400);
  }
  return normalized;
};

const getDecimalScale = (value: number): number => {
  const [mantissa, exponentText] = value.toString().toLowerCase().split("e");
  const fractionalDigits = mantissa?.split(".")[1]?.length ?? 0;
  const exponent = exponentText === undefined ? 0 : Number(exponentText);
  return Math.max(0, fractionalDigits - exponent);
};

const validatePrice = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new AppError(
      "INVALID_PRICE",
      "price must be a non-negative number",
      400,
    );
  }
  if (value > maxPrice) {
    throw new AppError(
      "INVALID_PRICE",
      "price must not exceed 9999999999.99",
      400,
    );
  }
  if (getDecimalScale(value) > 2) {
    throw new AppError(
      "INVALID_PRICE",
      "price must have at most two decimal places",
      400,
    );
  }
  return value;
};

const validateFields = (
  data: Record<string, unknown>,
  required: boolean,
): IPackageUpdateBody => {
  const result: IPackageUpdateBody = {};

  for (const field of ["name", "benefits", "tnc"] as const) {
    if (required || data[field] !== undefined) {
      result[field] = validateString(data[field], field);
    }
  }
  if (required || data.price !== undefined) {
    result.price = validatePrice(data.price);
  }

  return result;
};

export const findAll = async () => packagesRepository.findAll();

export const findById = async (id: number) => packagesRepository.findById(id);

export const insert = async (body: IPackageBody) => {
  const data = validateObjectBody(body);
  validateAllowedFields(data);
  const packageData = validateFields(data, true) as IPackageBody;
  return packagesRepository.insert(packageData);
};

export const update = async (id: number, body: IPackageUpdateBody) => {
  const data = validateObjectBody(body);
  validateAllowedFields(data);
  if (Object.keys(data).length === 0) {
    throw new AppError("MISSING_FIELD", "No fields to update", 400);
  }

  return packagesRepository.update(id, validateFields(data, false));
};

export const setActive = async (id: number, isActive: boolean) =>
  packagesRepository.setActive(id, isActive);
