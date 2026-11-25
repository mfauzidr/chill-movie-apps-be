import { AppError } from "../../shared/helper/appError";
import { IGenreBody } from "./genres.model";
import * as genresRepository from "./genres.repository";

export const findAll = async () => {
  return await genresRepository.findAll();
};

export const findById = async (id: number) => {
  return await genresRepository.findById(id);
};

export const insert = async (data: IGenreBody) => {
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

  const existingGenre = await genresRepository.findExistingGenre(name.trim());

  if (existingGenre.length > 0) {
    throw new AppError("GENRE_ALREADY_EXISTS", "Genre already Exist", 409);
  }

  return await genresRepository.insert({
    ...data,
    name: name.trim(),
  });
};

export const update = async (id: number, data: IGenreBody) => {
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

  const existingGenre = await genresRepository.findExistingGenre(
    name.trim(),
    id,
  );

  if (existingGenre.length > 0) {
    throw new AppError("GENRE_ALREADY_EXISTS", "Genre already exist", 409);
  }

  return await genresRepository.update(id, {
    ...data,
    name: name.trim(),
  });
};

export const deleteGenre = async (id: number) => {
  const affectedRows = await genresRepository.deleteGenre(id);

  if (affectedRows === 0) {
    throw new AppError("NOT_FOUND", "Genre not found", 404);
  }
};
