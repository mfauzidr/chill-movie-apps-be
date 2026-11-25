import { Router } from "express"
import { deleteUsers, getAllUsers, getUserByUuid, createUser, updateUser } from "./users.handler";

const usersRouter = Router();

usersRouter.get("/", getAllUsers)
usersRouter.get("/:uuid", getUserByUuid)
usersRouter.post("/", createUser)
usersRouter.patch("/:uuid", updateUser)
usersRouter.delete("/:uuid", deleteUsers)


export default usersRouter