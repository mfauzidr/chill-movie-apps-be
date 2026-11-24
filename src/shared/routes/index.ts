import { Router } from "express";
import { globalErrorHandler } from "../../middlewares/error.middleware";
import { requestLogger } from "../../middlewares/requestLogger.middleware";
import usersRouter from "../../modules/users/users.router";

const router = Router();
router.use(requestLogger);

router.use("/users", usersRouter)

router.use(globalErrorHandler);

export default router;
