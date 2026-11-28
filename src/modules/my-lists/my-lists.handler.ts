import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { IMyListCreateBody, IMyListParams } from "./my-lists.model";
import { IMyListResponse } from "../../shared/models/response.model";
import * as myListsService from "./my-lists.service";

export const getMyList = async (
  req: Request<IMyListParams>,
  res: Response<IMyListResponse>,
) => {
  const myList = await myListsService.findByUserUuid(req.params.userUuid);

  res.status(200).json({
    success: true,
    message: "MyList Retrieved Successfully.",
    results: myList,
  });
};

export const getMyListEntry = async (
  req: Request<IMyListParams>,
  res: Response<IMyListResponse>,
) => {
  const entry = await myListsService.findByUserAndContentUuid(
    req.params.userUuid,
    req.params.contentUuid,
  );
  if (entry.length === 0) {
    throw new AppError("NOT_FOUND", "MyList Entry Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "MyList Entry Retrieved Successfully.",
    results: entry,
  });
};

export const addContentToMyList = async (
  req: Request<IMyListParams, {}, IMyListCreateBody>,
  res: Response<IMyListResponse>,
) => {
  const entry = await myListsService.insert(
    req.params.userUuid,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Content Added to MyList Successfully.",
    results: entry,
  });
};

export const removeContentFromMyList = async (
  req: Request<IMyListParams>,
  res: Response<IMyListResponse>,
) => {
  await myListsService.deleteByUserAndContentUuid(
    req.params.userUuid,
    req.params.contentUuid,
  );

  res.status(200).json({
    success: true,
    message: "Content Removed from MyList Successfully.",
  });
};
