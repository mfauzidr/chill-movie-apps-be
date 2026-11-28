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

export const findByUserUuid = async (userUuid: string) =>
  myListsRepository.findByUserUuid(validateUuid(userUuid, "user_uuid"));

export const insert = async (
  userUuid: string,
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
    validateUuid(userUuid, "user_uuid"),
    validateUuid(body.content_uuid, "content_uuid"),
  );
};

export const deleteByUserAndContentUuid = async (
  userUuid: string,
  contentUuid: string | undefined,
) => {
  const affectedRows = await myListsRepository.deleteByUserAndContentUuid(
    validateUuid(userUuid, "user_uuid"),
    validateUuid(contentUuid, "content_uuid"),
  );

  if (affectedRows === 0) {
    throw new AppError("NOT_FOUND", "MyList Entry Not Found", 404);
  }
};
