import { Router } from "express";
import {
  createContent,
  deactivateContent,
  getAllContents,
  getContentByUuid,
  restoreContent,
  updateContent,
} from "./contents.handler";

const contentsRouter = Router();

contentsRouter.get("/", getAllContents);
contentsRouter.get("/:uuid", getContentByUuid);
contentsRouter.post("/", createContent);
contentsRouter.patch("/:uuid", updateContent);
contentsRouter.patch("/:uuid/deactivate", deactivateContent);
contentsRouter.patch("/:uuid/restore", restoreContent);

export default contentsRouter;
