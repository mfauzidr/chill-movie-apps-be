import { Router } from "express";
import {
  getAllPayments,
  getPaymentById,
  getPaymentByOrderUuid,
  updatePayment,
} from "./payments.handler";

const paymentsRouter = Router();

paymentsRouter.get("/", getAllPayments);
paymentsRouter.get("/order/:order_uuid", getPaymentByOrderUuid);
paymentsRouter.get("/:id", getPaymentById);
paymentsRouter.patch("/:id", updatePayment);

export default paymentsRouter;
