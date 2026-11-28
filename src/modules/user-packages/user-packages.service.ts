import { AppError } from "../../shared/helper/appError";
import {
  IUserPackageCreateBody,
  IUserPackageStatus,
  IUserPackageUpdateBody,
} from "./user-packages.model";
import * as userPackagesRepository from "./user-packages.repository";

const statuses: IUserPackageStatus[] = ["active", "expired", "cancelled"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const allowedCreateFields = ["package_uuid", "start_date", "end_date", "status"];
const allowedUpdateFields = ["start_date", "end_date", "status"];

const validateObjectBody = (body: unknown): Record<string, unknown> => {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("INVALID_BODY", "Request body must be a valid object", 400);
  }
  return body as Record<string, unknown>;
};

const validateFields = (
  data: Record<string, unknown>,
  allowedFields: string[],
) => {
  const invalidFields = Object.keys(data).filter((field) => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    throw new AppError("INVALID_FIELD", `Invalid fields: ${invalidFields.join(", ")}`, 400);
  }
};

const validateUuid = (value: unknown, field: string): string => {
  if (typeof value !== "string" || !uuidPattern.test(value.trim())) {
    throw new AppError(`INVALID_${field.toUpperCase()}`, `${field} must be a valid UUID`, 400);
  }
  return value.trim();
};

const validateDateTime = (value: unknown, field: string): string => {
  if (typeof value !== "string") {
    throw new AppError(`INVALID_${field.toUpperCase()}`, `${field} must be a valid date and time`, 400);
  }
  const normalized = value.trim().replace("T", " ");
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(normalized);
  if (!match) {
    throw new AppError(`INVALID_${field.toUpperCase()}`, `${field} must be a valid date and time`, 400);
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (
    month < 1 || month > 12 ||
    day < 1 || day > daysInMonth ||
    hour > 23 || minute > 59 || second > 59
  ) {
    throw new AppError(`INVALID_${field.toUpperCase()}`, `${field} must be a valid date and time`, 400);
  }

  return normalized;
};

const validateStatus = (value: unknown): IUserPackageStatus => {
  if (typeof value !== "string" || !statuses.includes(value as IUserPackageStatus)) {
    throw new AppError("INVALID_STATUS", "status must be active, expired, or cancelled", 400);
  }
  return value as IUserPackageStatus;
};

const validateDateRange = (startDate: string, endDate: string) => {
  if (Date.parse(endDate) <= Date.parse(startDate)) {
    throw new AppError("INVALID_DATE_RANGE", "end_date must be later than start_date", 400);
  }
};

export const findAll = async () => userPackagesRepository.findAll();

export const findById = async (id: number) => userPackagesRepository.findById(id);

export const findByUserUuid = async (user_uuid: string) =>
  userPackagesRepository.findByUserUuid(validateUuid(user_uuid, "user_uuid"));

export const insert = async (user_uuid: string, body: IUserPackageCreateBody) => {
  const data = validateObjectBody(body);
  validateFields(data, allowedCreateFields);
  const userPackageData: IUserPackageCreateBody = {
    package_uuid: validateUuid(data.package_uuid, "package_uuid"),
    start_date: validateDateTime(data.start_date, "start_date"),
    end_date: validateDateTime(data.end_date, "end_date"),
    status: validateStatus(data.status),
  };
  validateDateRange(userPackageData.start_date, userPackageData.end_date);

  return userPackagesRepository.insert(
    validateUuid(user_uuid, "user_uuid"),
    userPackageData,
  );
};

export const update = async (id: number, body: IUserPackageUpdateBody) => {
  const data = validateObjectBody(body);
  validateFields(data, allowedUpdateFields);
  if (Object.keys(data).length === 0) {
    throw new AppError("MISSING_FIELD", "No fields to update", 400);
  }

  const updates: IUserPackageUpdateBody = {};
  if (data.start_date !== undefined) {
    updates.start_date = validateDateTime(data.start_date, "start_date");
  }
  if (data.end_date !== undefined) {
    updates.end_date = validateDateTime(data.end_date, "end_date");
  }
  if (data.status !== undefined) {
    updates.status = validateStatus(data.status);
  }

  if (updates.start_date !== undefined || updates.end_date !== undefined) {
    const existing = await userPackagesRepository.findDatesById(id);
    if (!existing) return [];
    validateDateRange(
      updates.start_date ?? existing.start_date,
      updates.end_date ?? existing.end_date,
    );
  }

  return userPackagesRepository.update(id, updates);
};
