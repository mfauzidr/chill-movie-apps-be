import { AppError } from "../../shared/helper/appError";
import { IMyListCreateBody } from "./my-lists.model";
import * as myListsRepository from "./my-lists.repository";

const validateUuid = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length !== 36) {
    throw new AppError(
      `INVALID_${field.toUpperCase()}`,
      `${field} must be a 36-character UUID`,
      400,
    );
  }
  return value.trim();
};

export const findByUserUuid = async (user_uuid: string) =>
  myListsRepository.findByUserUuid(validateUuid(user_uuid, "user_uuid"));

export const insert = async (
  user_uuid: string,
  body: IMyListCreateBody,
) => {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("INVALID_BODY", "Request body must be a valid object", 400);
  }

  const invalidFields = Object.keys(body).filter(
    (field) => field !== "content_uuid",
  );
  if (invalidFields.length > 0) {
    throw new AppError(
      "INVALID_FIELD",
      `Invalid fields: ${invalidFields.join(", ")}`,
      400,
    );
  }

  return myListsRepository.insert(
    validateUuid(user_uuid, "user_uuid"),
    validateUuid(body.content_uuid, "content_uuid"),
  );
};

export const deleteByUserAndContentUuid = async (
  user_uuid: string,
  content_uuid: string | undefined,
) => {
  const affectedRows = await myListsRepository.deleteByUserAndContentUuid(
    validateUuid(user_uuid, "user_uuid"),
    validateUuid(content_uuid, "content_uuid"),
  );

  if (affectedRows === 0) {
    throw new AppError("NOT_FOUND", "MyList Entry Not Found", 404);
  }
};
