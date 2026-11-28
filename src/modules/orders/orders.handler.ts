import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { parsePositiveIntegerId } from "../../shared/helper/textValidation";
import { IOrderResponse } from "../../shared/models/response.model";
import {
  IOrderCreateBody,
  IOrderParams,
  IOrderUpdateBody,
} from "./orders.model";
import * as ordersService from "./orders.service";

export const getAllOrders = async (
  req: Request,
  res: Response<IOrderResponse>,
) => {
  const orders = await ordersService.findAll();
  res.status(200).json({
    success: true,
    message: "Orders Retrieved Successfully.",
    results: orders,
  });
};

export const getOrderById = async (
  req: Request<IOrderParams>,
  res: Response<IOrderResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "order");
  const orders = await ordersService.findById(id);
  if (orders.length === 0) {
    throw new AppError("NOT_FOUND", "Order Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Order Retrieved Successfully.",
    results: orders,
  });
};

export const updateOrder = async (
  req: Request<IOrderParams, {}, IOrderUpdateBody>,
  res: Response<IOrderResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "order");
  const orders = await ordersService.update(id, req.body);
  if (orders.length === 0) {
    throw new AppError("NOT_FOUND", "Order Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Order Updated Successfully.",
    results: orders,
  });
};

export const getOrdersByUser = async (
  req: Request<IOrderParams>,
  res: Response<IOrderResponse>,
) => {
  const orders = await ordersService.findByUserUuid(req.params.user_uuid);
  res.status(200).json({
    success: true,
    message: "Orders Retrieved Successfully.",
    results: orders,
  });
};

export const createOrder = async (
  req: Request<IOrderParams, {}, IOrderCreateBody>,
  res: Response<IOrderResponse>,
) => {
  const orders = await ordersService.insert(req.params.user_uuid, req.body);
  res.status(201).json({
    success: true,
    message: "Order Created Successfully.",
    results: orders,
  });
};
