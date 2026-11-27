import { AppError } from "./appError";

export const codePointLength = (value: string): number => Array.from(value).length;

export const parsePositiveIntegerId = (
  rawId: string | undefined,
  resourceName: string,
): number => {
  if (!rawId) {
    throw new AppError("NO_ID", "ID must be provided", 400);
  }

  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("INVALID_ID", `Invalid ${resourceName} ID`, 400);
  }

  return id;
};
