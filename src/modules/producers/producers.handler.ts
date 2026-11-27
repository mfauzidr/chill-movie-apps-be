import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { IProducerBody, IProducerParams } from "./producers.model";
import * as producerServices from "./producers.service";
import { IProducerResponse } from "../../shared/models/response.model";
import { parsePositiveIntegerId } from "../../shared/helper/textValidation";

export const getAllProducers = async (
  req: Request,
  res: Response<IProducerResponse>,
) => {
  const producers = await producerServices.findAll();
  if (producers.length < 1) {
    throw new AppError("NOT_DATA", "No Data Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Producers Retrieved Successfully.",
    results: producers,
  });
};

export const getProducerById = async (
  req: Request<IProducerParams>,
  res: Response<IProducerResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "producer");

  const producer = await producerServices.findById(id);
  if (producer.length === 0) {
    throw new AppError("NOT_FOUND", "Producer Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Producer Retrieved Successfully.",
    results: producer,
  });
};

export const createProducer = async (
  req: Request<{}, {}, IProducerBody>,
  res: Response<IProducerResponse>,
) => {
  const producer = await producerServices.insert(req.body);

  res.status(201).json({
    success: true,
    message: "Producer Created Successfully.",
    results: producer,
  });
};

export const updateProducer = async (
  req: Request<IProducerParams, {}, IProducerBody>,
  res: Response<IProducerResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "producer");

  const producer = await producerServices.update(id, req.body);
  if (producer.length === 0) {
    throw new AppError("NOT_FOUND", "Producer Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Producer Updated Successfully.",
    results: producer,
  });
};

export const deleteProducer = async (
  req: Request<IProducerParams>,
  res: Response<IProducerResponse>,
) => {
  const id = parsePositiveIntegerId(req.params.id, "producer");

  await producerServices.deleteProducer(id);

  res.status(200).json({
    success: true,
    message: "Producer Deleted Successfully.",
  });
};
