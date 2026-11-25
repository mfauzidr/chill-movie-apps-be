import { Router } from "express";
import { globalErrorHandler } from "../../middlewares/error.middleware";
import { requestLogger } from "../../middlewares/requestLogger.middleware";
import usersRouter from "../../modules/users/users.router";
import genresRouter from "../../modules/genres/genres.router";

const router = Router();
router.use(requestLogger);

router.use("/users", usersRouter)
router.use("/genres", genresRouter)

router.use(globalErrorHandler);

export default router;
