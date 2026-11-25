import { Request, Response } from "express";
import { IGenreBody, IGenreParams } from "./genres.model";
import * as genreServices from "./genres.service";
import { AppError } from "../../shared/helper/appError";
import { IGenreResponse } from "../../shared/models/response.model";

export const getAllGenres = async (
  req: Request,
  res: Response<IGenreResponse>,
) => {
  const genres = await genreServices.findAll();
  if (genres.length < 1) {
    throw new AppError("NOT_DATA", "No Data Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Genres Retrieved Successfully.",
    results: genres,
  });
};

export const getGenreById = async (
  req: Request<IGenreParams>,
  res: Response<IGenreResponse>,
) => {
  const rawId = req.params.id;
  if (!rawId) {
    throw new AppError("NO_ID", "ID must be provided", 400);
  }

  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new AppError("INVALID_ID", "Invalid genre ID", 400);
  }

  const genre = await genreServices.findById(id);
  if (genre.length === 0) {
    throw new AppError("NOT_FOUND", "Genre Not Found", 404);
  }
  res.status(200).json({
    success: true,
    message: "Genre Retrieved Successfully.",
    results: genre,
  });
};

export const createGenre = async (
  req: Request<{}, {}, IGenreBody>,
  res: Response<IGenreResponse>,
) => {
  const genre = await genreServices.insert(req.body);

  res.status(201).json({
    success: true,
    message: "Genre Created Successfully.",
    results: genre,
  });
};

export const updateGenre = async (
  req: Request<IGenreParams, {}, IGenreBody>,
  res: Response<IGenreResponse>,
) => {
  const rawId = req.params.id;
  if (!rawId) {
    throw new AppError("NO_ID", "ID must be provided", 400);
  }

  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new AppError("INVALID_ID", "Invalid genre ID", 400);
  }

  const genre = await genreServices.update(id, req.body);

  if (genre.length === 0) {
    throw new AppError("NOT_FOUND", "Genre Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Genre Updated Successfully.",
    results: genre,
  });
};

export const deleteGenre = async (
  req: Request<IGenreParams>,
  res: Response<IGenreResponse>,
) => {
  const rawId = req.params.id;
  if (!rawId) {
    throw new AppError("NO_ID", "ID must be provided", 400);
  }

  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new AppError("INVALID_ID", "Invalid genre ID", 400);
  }
  await genreServices.deleteGenre(id);

  res.status(200).json({
    success: true,
    message: "Genre Deleted Successfully.",
  });
};
