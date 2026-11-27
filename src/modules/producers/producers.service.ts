import { AppError } from "../../shared/helper/appError";
import { IProducerBody } from "./producers.model";
import * as producersRepository from "./producers.repository";
import { codePointLength } from "../../shared/helper/textValidation";

export const findAll = async () => {
  return await producersRepository.findAll();
};

export const findById = async (id: number) => {
  return await producersRepository.findById(id);
};

const validateBody = (data: IProducerBody) => {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new AppError("INVALID_BODY", "Request body must be a valid object", 400);
  }

  const allowedFields = ["name"];
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

  const { name } = data;
  if (typeof name !== "string" || !name.trim()) {
    throw new AppError("INVALID_NAME", "Name must be a non-empty string", 400);
  }

  const normalizedName = name.trim();
  if (codePointLength(normalizedName) > 255) {
    throw new AppError("INVALID_NAME", "Name must be at most 255 characters", 400);
  }

  return normalizedName;
};

export const insert = async (data: IProducerBody) => {
  const name = validateBody(data);
  const existingProducer = await producersRepository.findExistingProducer(name);

  if (existingProducer.length > 0) {
    throw new AppError("PRODUCER_ALREADY_EXISTS", "Producer already exists", 409);
  }

  return await producersRepository.insert({ name });
};

export const update = async (id: number, data: IProducerBody) => {
  const name = validateBody(data);
  const existingProducer = await producersRepository.findExistingProducer(name, id);

  if (existingProducer.length > 0) {
    throw new AppError("PRODUCER_ALREADY_EXISTS", "Producer already exists", 409);
  }

  return await producersRepository.update(id, { name });
};

export const deleteProducer = async (id: number) => {
  const affectedRows = await producersRepository.deleteProducer(id);

  if (affectedRows === 0) {
    throw new AppError("NOT_FOUND", "Producer not found", 404);
  }
};
