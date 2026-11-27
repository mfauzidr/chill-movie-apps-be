import { Router } from "express";
import {
  createPackage,
  deactivatePackage,
  getAllPackages,
  getPackageById,
  restorePackage,
  updatePackage,
} from "./packages.handler";

const packagesRouter = Router();

packagesRouter.get("/", getAllPackages);
packagesRouter.get("/:id", getPackageById);
packagesRouter.post("/", createPackage);
packagesRouter.patch("/:id", updatePackage);
packagesRouter.patch("/:id/deactivate", deactivatePackage);
packagesRouter.patch("/:id/restore", restorePackage);

export default packagesRouter;
