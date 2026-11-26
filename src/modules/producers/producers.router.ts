import { Router } from "express";
import {
  createProducer,
  deleteProducer,
  getAllProducers,
  getProducerById,
  updateProducer,
} from "./producers.handler";

const producersRouter = Router();

producersRouter.get("/", getAllProducers);
producersRouter.get("/:id", getProducerById);
producersRouter.post("/", createProducer);
producersRouter.patch("/:id", updateProducer);
producersRouter.delete("/:id", deleteProducer);

export default producersRouter;
