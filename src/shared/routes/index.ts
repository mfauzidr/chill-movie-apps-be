import { Router } from "express";
import { globalErrorHandler } from "../../middlewares/error.middleware";
import { requestLogger } from "../../middlewares/requestLogger.middleware";
import usersRouter from "../../modules/users/users.router";
import genresRouter from "../../modules/genres/genres.router";
import producersRouter from "../../modules/producers/producers.router";
import castsRouter from "../../modules/casts/casts.router";
import contentsRouter from "../../modules/contents/contents.router";
import packagesRouter from "../../modules/packages/packages.router";
import myListsRouter from "../../modules/my-lists/my-lists.router";
import paymentsRouter from "../../modules/payments/payments.router";
import { ordersByUserRouter, ordersRouter } from "../../modules/orders/orders.router";
import {
  userPackagesByUserRouter,
  userPackagesRouter,
} from "../../modules/user-packages/user-packages.router";

const router = Router();
router.use(requestLogger);

router.use("/users", usersRouter)
router.use("/genres", genresRouter)
router.use("/producers", producersRouter)
router.use("/casts", castsRouter)
router.use("/contents", contentsRouter)
router.use("/packages", packagesRouter)
router.use("/user-packages", userPackagesRouter)
router.use("/orders", ordersRouter)
router.use("/payments", paymentsRouter)
router.use("/users/:user_uuid/my-lists", myListsRouter)
router.use("/users/:user_uuid/packages", userPackagesByUserRouter)
router.use("/users/:user_uuid/orders", ordersByUserRouter)

router.use(globalErrorHandler);

export default router;
