import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { ICastBody, ICastParams } from "./casts.model";
import * as castsService from "./casts.service";
import { ICastResponse } from "../../shared/models/response.model";
import { parsePositiveIntegerId } from "../../shared/helper/textValidation";

export const getAllCasts = async (
  req: Request,
  res: Response<ICastResponse>,
) => {
  const casts = await castsService.findAll();
  if (casts.length < 1) {
    throw new AppError("NOT_DATA", "No Data Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Casts Retrieved Successfully.",
    results: casts,
  });
};

export const getCastById = async (
  req: Request<ICastParams>,
  res: Response<ICastResponse>,
) => {
  const cast = await castsService.findById(parsePositiveIntegerId(req.params.id, "cast"));
  if (cast.length === 0) {
    throw new AppError("NOT_FOUND", "Cast Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Cast Retrieved Successfully.",
    results: cast,
  });
};

export const createCast = async (
  req: Request<{}, {}, ICastBody>,
  res: Response<ICastResponse>,
) => {
  const cast = await castsService.insert(req.body);

  res.status(201).json({
    success: true,
    message: "Cast Created Successfully.",
    results: cast,
  });
};

export const updateCast = async (
  req: Request<ICastParams, {}, ICastBody>,
  res: Response<ICastResponse>,
) => {
  const cast = await castsService.update(parsePositiveIntegerId(req.params.id, "cast"), req.body);
  if (cast.length === 0) {
    throw new AppError("NOT_FOUND", "Cast Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Cast Updated Successfully.",
    results: cast,
  });
};

export const deleteCast = async (
  req: Request<ICastParams>,
  res: Response<ICastResponse>,
) => {
  await castsService.deleteCast(parsePositiveIntegerId(req.params.id, "cast"));

  res.status(200).json({
    success: true,
    message: "Cast Deleted Successfully.",
  });
};
