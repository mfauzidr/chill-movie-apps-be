import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { parsePositiveIntegerId } from "../../shared/helper/textValidation";
import { IPaymentResponse } from "../../shared/models/response.model";
import { IPaymentParams, IPaymentUpdateBody } from "./payments.model";
import * as paymentsService from "./payments.service";

export const getAllPayments = async (
  req: Request,
  res: Response<IPaymentResponse>,
) => {
  const payments = await paymentsService.findAll();
  res.status(200).json({
    success: true,
    message: "Payments Retrieved Successfully.",
    results: payments,
  });
};

export const getPaymentById = async (
  req: Request<IPaymentParams>,
  res: Response<IPaymentResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "payment");
  const payments = await paymentsService.findById(id);
  if (payments.length === 0) {
    throw new AppError("NOT_FOUND", "Payment Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Payment Retrieved Successfully.",
    results: payments,
  });
};

export const getPaymentByOrderUuid = async (
  req: Request<IPaymentParams>,
  res: Response<IPaymentResponse>,
) => {
  const payments = await paymentsService.findByOrderUuid(req.params.order_uuid);
  if (payments.length === 0) {
    throw new AppError("NOT_FOUND", "Payment Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Payment Retrieved Successfully.",
    results: payments,
  });
};

export const updatePayment = async (
  req: Request<IPaymentParams, {}, IPaymentUpdateBody>,
  res: Response<IPaymentResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "payment");
  const payments = await paymentsService.update(id, req.body);
  if (payments.length === 0) {
    throw new AppError("NOT_FOUND", "Payment Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Payment Updated Successfully.",
    results: payments,
  });
};
