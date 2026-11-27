import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { parsePositiveIntegerId } from "../../shared/helper/textValidation";
import { IPackageResponse } from "../../shared/models/response.model";
import * as packagesService from "./packages.service";
import {
  IPackageBody,
  IPackageParams,
  IPackageUpdateBody,
} from "./packages.model";

export const getAllPackages = async (
  req: Request,
  res: Response<IPackageResponse>,
) => {
  const packages = await packagesService.findAll();
  if (packages.length === 0) {
    throw new AppError("NOT_DATA", "No Data Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Packages Retrieved Successfully.",
    results: packages,
  });
};

export const getPackageById = async (
  req: Request<IPackageParams>,
  res: Response<IPackageResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "package");
  const packages = await packagesService.findById(id);
  if (packages.length === 0) {
    throw new AppError("NOT_FOUND", "Package Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Package Retrieved Successfully.",
    results: packages,
  });
};

export const createPackage = async (
  req: Request<{}, {}, IPackageBody>,
  res: Response<IPackageResponse>,
) => {
  const packages = await packagesService.insert(req.body);
  res.status(201).json({
    success: true,
    message: "Package Created Successfully.",
    results: packages,
  });
};

export const updatePackage = async (
  req: Request<IPackageParams, {}, IPackageUpdateBody>,
  res: Response<IPackageResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "package");
  const packages = await packagesService.update(id, req.body);
  if (packages.length === 0) {
    throw new AppError("NOT_FOUND", "Package Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Package Updated Successfully.",
    results: packages,
  });
};

export const deactivatePackage = async (
  req: Request<IPackageParams>,
  res: Response<IPackageResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "package");
  const packages = await packagesService.setActive(id, false);
  if (packages.length === 0) {
    throw new AppError("NOT_FOUND", "Package Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Package Deactivated Successfully.",
    results: packages,
  });
};

export const restorePackage = async (
  req: Request<IPackageParams>,
  res: Response<IPackageResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "package");
  const packages = await packagesService.setActive(id, true);
  if (packages.length === 0) {
    throw new AppError("NOT_FOUND", "Package Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Package Restored Successfully.",
    results: packages,
  });
};
