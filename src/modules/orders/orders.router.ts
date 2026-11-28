import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
} from "./orders.handler";

export const ordersRouter = Router();

ordersRouter.get("/", getAllOrders);
ordersRouter.get("/:id", getOrderById);
ordersRouter.patch("/:id", updateOrder);

export const ordersByUserRouter = Router({ mergeParams: true });

ordersByUserRouter.get("/", getOrdersByUser);
ordersByUserRouter.post("/", createOrder);
