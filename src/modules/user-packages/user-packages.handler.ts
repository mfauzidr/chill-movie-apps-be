import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { parsePositiveIntegerId } from "../../shared/helper/textValidation";
import { IUserPackageResponse } from "../../shared/models/response.model";
import {
  IUserPackageCreateBody,
  IUserPackageParams,
  IUserPackageUpdateBody,
  IUserPackageUserParams,
} from "./user-packages.model";
import * as userPackagesService from "./user-packages.service";

export const getAllUserPackages = async (
  req: Request,
  res: Response<IUserPackageResponse>,
) => {
  const records = await userPackagesService.findAll();
  res.status(200).json({
    success: true,
    message: "User Packages Retrieved Successfully.",
    results: records,
  });
};

export const getUserPackageById = async (
  req: Request<IUserPackageParams>,
  res: Response<IUserPackageResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "user package");
  const records = await userPackagesService.findById(id);
  if (records.length === 0) {
    throw new AppError("NOT_FOUND", "User Package Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User Package Retrieved Successfully.",
    results: records,
  });
};

export const getUserPackagesByUser = async (
  req: Request<IUserPackageUserParams>,
  res: Response<IUserPackageResponse>,
) => {
  const records = await userPackagesService.findByUserUuid(req.params.user_uuid);
  res.status(200).json({
    success: true,
    message: "User Packages Retrieved Successfully.",
    results: records,
  });
};

export const createUserPackage = async (
  req: Request<IUserPackageUserParams, {}, IUserPackageCreateBody>,
  res: Response<IUserPackageResponse>,
) => {
  const records = await userPackagesService.insert(req.params.user_uuid, req.body);
  res.status(201).json({
    success: true,
    message: "User Package Created Successfully.",
    results: records,
  });
};

export const updateUserPackage = async (
  req: Request<IUserPackageParams, {}, IUserPackageUpdateBody>,
  res: Response<IUserPackageResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "user package");
  const records = await userPackagesService.update(id, req.body);
  if (records.length === 0) {
    throw new AppError("NOT_FOUND", "User Package Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User Package Updated Successfully.",
    results: records,
  });
};
