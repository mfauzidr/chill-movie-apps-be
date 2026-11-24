import { Router } from "express"
import { deleteUsers, getAllUsers, getUserByUuid, insertUser, updateUser } from "./users.handler";

const usersRouter = Router();

usersRouter.get("/", getAllUsers)
usersRouter.get("/:uuid", getUserByUuid)
usersRouter.post("/", insertUser)
usersRouter.patch("/:uuid", updateUser)
usersRouter.delete("/:uuid", deleteUsers)


export default usersRouter