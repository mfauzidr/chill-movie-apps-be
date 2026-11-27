import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { IContentParams, IContentCreateBody, IContentUpdateBody } from "./contents.model";
import * as contentsService from "./contents.service";
import { IContentResponse } from "../../shared/models/response.model";

const getUuid = (uuid: string | undefined): string => {
  if (!uuid) {
    throw new AppError("NO_ID", "UUID must be provided", 400);
  }
  return uuid;
};

export const getAllContents = async (
  req: Request,
  res: Response<IContentResponse>,
) => {
  const contents = await contentsService.findAll();
  if (contents.length === 0) {
    throw new AppError("NOT_DATA", "No Data Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Contents Retrieved Successfully.",
    results: contents,
  });
};

export const getContentByUuid = async (
  req: Request<IContentParams>,
  res: Response<IContentResponse>,
) => {
  const contents = await contentsService.findByUuid(getUuid(req.params.uuid));
  if (contents.length === 0) {
    throw new AppError("NOT_FOUND", "Content Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Content Retrieved Successfully.",
    results: contents,
  });
};

export const createContent = async (
  req: Request<{}, {}, IContentCreateBody>,
  res: Response<IContentResponse>,
) => {
  const content = await contentsService.insert(req.body);
  res.status(201).json({
    success: true,
    message: "Content Created Successfully.",
    results: content,
  });
};

export const updateContent = async (
  req: Request<IContentParams, {}, IContentUpdateBody>,
  res: Response<IContentResponse>,
) => {
  const content = await contentsService.update(
    getUuid(req.params.uuid),
    req.body,
  );
  if (content.length === 0) {
    throw new AppError("NOT_FOUND", "Content Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Content Updated Successfully.",
    results: content,
  });
};

export const deactivateContent = async (
  req: Request<IContentParams>,
  res: Response<IContentResponse>,
) => {
  const content = await contentsService.setActive(
    getUuid(req.params.uuid),
    false,
  );
  if (content.length === 0) {
    throw new AppError("NOT_FOUND", "Content Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Content Deactivated Successfully.",
    results: content,
  });
};

export const restoreContent = async (
  req: Request<IContentParams>,
  res: Response<IContentResponse>,
) => {
  const content = await contentsService.setActive(
    getUuid(req.params.uuid),
    true,
  );
  if (content.length === 0) {
    throw new AppError("NOT_FOUND", "Content Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Content Restored Successfully.",
    results: content,
  });
};
