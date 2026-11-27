import { AppError } from "../../shared/helper/appError";
import { ICastBody } from "./casts.model";
import * as castsRepository from "./casts.repository";
import { codePointLength } from "../../shared/helper/textValidation";

export const findAll = async () => castsRepository.findAll();

export const findById = async (id: number) => castsRepository.findById(id);

const validateBody = (data: ICastBody): string => {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new AppError("INVALID_BODY", "Request body must be a valid object", 400);
  }

  const invalidFields = Object.keys(data).filter((field) => field !== "name");
  if (invalidFields.length > 0) {
    throw new AppError(
      "INVALID_FIELD",
      `Invalid fields: ${invalidFields.join(", ")}`,
      400,
    );
  }

  if (typeof data.name !== "string" || !data.name.trim()) {
    throw new AppError("INVALID_NAME", "Name must be a non-empty string", 400);
  }

  const name = data.name.trim();
  if (codePointLength(name) > 255) {
    throw new AppError("INVALID_NAME", "Name must be at most 255 characters", 400);
  }

  return name;
};

export const insert = async (data: ICastBody) => {
  const name = validateBody(data);
  return castsRepository.insert({ name });
};

export const update = async (id: number, data: ICastBody) => {
  const name = validateBody(data);
  return castsRepository.update(id, { name });
};

export const deleteCast = async (id: number) => {
  let affectedRows: number;

  try {
    affectedRows = await castsRepository.deleteCast(id);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_ROW_IS_REFERENCED_2"
    ) {
      throw new AppError(
        "CAST_IN_USE",
        "Cast cannot be deleted while linked to content",
        409,
      );
    }

    throw error;
  }

  if (affectedRows === 0) {
    throw new AppError("NOT_FOUND", "Cast not found", 404);
  }
};
