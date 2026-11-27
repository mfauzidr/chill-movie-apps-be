import { AppError } from "../../shared/helper/appError";
import { codePointLength } from "../../shared/helper/textValidation";
import {
  IContentCreateBody,
  IContentUpdateBody,
} from "./contents.model";
import * as contentsRepository from "./contents.repository";

const createFields = [
  "title",
  "release_date",
  "synopsis",
  "age_rating",
  "poster",
  "banner",
  "content_type",
  "is_premium",
  "is_active",
  "genre_ids",
  "cast_ids",
  "producer_ids",
];

const updateFields = [
  "title",
  "release_date",
  "synopsis",
  "age_rating",
  "poster",
  "banner",
  "content_type",
  "is_premium",
];

const validateObjectBody = (data: unknown): Record<string, unknown> => {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new AppError("INVALID_BODY", "Request body must be a valid object", 400);
  }
  return data as Record<string, unknown>;
};

const validateAllowedFields = (
  data: Record<string, unknown>,
  allowedFields: string[],
) => {
  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field),
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
  field: string,
  maxLength?: number,
): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `${field} must be a non-empty string`,
      400,
    );
  }

  const normalized = value.trim();
  if (maxLength !== undefined && codePointLength(normalized) > maxLength) {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `${field} must be at most ${maxLength} characters`,
      400,
    );
  }
  return normalized;
};

const validateReleaseDate = (value: unknown): string => {
  const releaseDate = validateString(value, "release_date");
  const parsed = new Date(`${releaseDate}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== releaseDate
  ) {
    throw new AppError(
      "INVALID_RELEASE_DATE",
      "release_date must be a valid date in YYYY-MM-DD format",
      400,
    );
  }
  return releaseDate;
};

const validateContentType = (value: unknown): "movie" | "series" => {
  if (value !== "movie" && value !== "series") {
    throw new AppError(
      "INVALID_CONTENT_TYPE",
      "content_type must be movie or series",
      400,
    );
  }
  return value;
};

const validateBoolean = (value: unknown, field: string): boolean => {
  if (typeof value !== "boolean") {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `${field} must be a boolean`,
      400,
    );
  }
  return value;
};

const validateIds = (value: unknown, field: string): number[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new AppError(`INVALID_${field.toUpperCase()}`, `${field} must be an array`, 400);
  }

  const ids = value as unknown[];
  if (!ids.every((id) => Number.isInteger(id) && Number(id) > 0)) {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `${field} must contain positive integer IDs`,
      400,
    );
  }

  const numericIds = ids as number[];
  if (new Set(numericIds).size !== numericIds.length) {
    throw new AppError(
      `DUPLICATE_${field.toUpperCase()}`,
      `${field} must not contain duplicate IDs`,
      400,
    );
  }
  return numericIds;
};

const validateRequiredContentFields = (
  data: Record<string, unknown>,
  required: boolean,
) => {
  const result: Partial<IContentCreateBody> = {};
  const stringFields = [
    ["title", 255],
    ["synopsis", undefined],
    ["age_rating", 10],
    ["poster", undefined],
    ["banner", undefined],
  ] as const;

  for (const [field, maxLength] of stringFields) {
    const value = data[field];
    if (required || value !== undefined) {
      result[field] = validateString(value, field, maxLength);
    }
  }

  if (required || data.release_date !== undefined) {
    result.release_date = validateReleaseDate(data.release_date);
  }
  if (required || data.content_type !== undefined) {
    result.content_type = validateContentType(data.content_type);
  }
  if (data.is_premium !== undefined) {
    result.is_premium = validateBoolean(data.is_premium, "is_premium");
  }

  return result;
};

const validateExistingIds = async (
  table: "genres" | "casts" | "producers",
  ids: number[],
  field: string,
) => {
  if (ids.length === 0) return;
  const existingIds = await contentsRepository.findExistingIds(table, ids);
  const existingSet = new Set(existingIds);
  const missingIds = ids.filter((id) => !existingSet.has(id));
  if (missingIds.length > 0) {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `Unknown ${field}: ${missingIds.join(", ")}`,
      400,
    );
  }
};

export const findAll = async () => contentsRepository.findAll();

export const findByUuid = async (uuid: string) =>
  contentsRepository.findByUuid(uuid);

export const insert = async (body: IContentCreateBody) => {
  const data = validateObjectBody(body);
  validateAllowedFields(data, createFields);

  const content = validateRequiredContentFields(data, true) as IContentCreateBody;
  const genreIds = validateIds(data.genre_ids, "genre_ids");
  const castIds = validateIds(data.cast_ids, "cast_ids");
  const producerIds = validateIds(data.producer_ids, "producer_ids");

  await Promise.all([
    validateExistingIds("genres", genreIds, "genre_ids"),
    validateExistingIds("casts", castIds, "cast_ids"),
    validateExistingIds("producers", producerIds, "producer_ids"),
  ]);

  return contentsRepository.insertWithRelations({
    ...content,
    genre_ids: genreIds,
    cast_ids: castIds,
    producer_ids: producerIds,
  });
};

export const update = async (uuid: string, body: IContentUpdateBody) => {
  const data = validateObjectBody(body);
  validateAllowedFields(data, updateFields);
  if (Object.keys(data).length === 0) {
    throw new AppError("MISSING_FIELD", "No fields to update", 400);
  }

  const validated = validateRequiredContentFields(data, false);
  return contentsRepository.update(uuid, validated as IContentUpdateBody);
};

export const setActive = async (uuid: string, isActive: boolean) =>
  contentsRepository.setActive(uuid, isActive);
