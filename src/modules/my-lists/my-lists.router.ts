import { Router } from "express";
import {
  addContentToMyList,
  getMyList,
  removeContentFromMyList,
} from "./my-lists.handler";

const myListsRouter = Router({ mergeParams: true });

myListsRouter.get("/", getMyList);
myListsRouter.post("/", addContentToMyList);
myListsRouter.delete("/:content_uuid", removeContentFromMyList);

export default myListsRouter;
