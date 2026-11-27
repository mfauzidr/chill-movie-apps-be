import { Router } from "express";
import {
  createCast,
  deleteCast,
  getAllCasts,
  getCastById,
  updateCast,
} from "./casts.handler";

const castsRouter = Router();

castsRouter.get("/", getAllCasts);
castsRouter.get("/:id", getCastById);
castsRouter.post("/", createCast);
castsRouter.patch("/:id", updateCast);
castsRouter.delete("/:id", deleteCast);

export default castsRouter;
