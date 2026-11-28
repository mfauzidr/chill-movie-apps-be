import { Router } from "express";
import {
  createUserPackage,
  getAllUserPackages,
  getUserPackageById,
  getUserPackagesByUser,
  updateUserPackage,
} from "./user-packages.handler";

export const userPackagesRouter = Router();

userPackagesRouter.get("/", getAllUserPackages);
userPackagesRouter.get("/:id", getUserPackageById);
userPackagesRouter.patch("/:id", updateUserPackage);

export const userPackagesByUserRouter = Router({ mergeParams: true });

userPackagesByUserRouter.get("/", getUserPackagesByUser);
userPackagesByUserRouter.post("/", createUserPackage);
