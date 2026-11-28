import { Request, Response } from "express";
import { AppError } from "../../shared/helper/appError";
import { IMyListCreateBody, IMyListParams } from "./my-lists.model";
import { IMyListResponse } from "../../shared/models/response.model";
import * as myListsService from "./my-lists.service";

export const getMyList = async (
  req: Request<IMyListParams>,
  res: Response<IMyListResponse>,
) => {
  const myList = await myListsService.findByUserUuid(req.params.user_uuid);

  res.status(200).json({
    success: true,
    message: "MyList Retrieved Successfully.",
    results: myList,
  });
};

export const addContentToMyList = async (
  req: Request<IMyListParams, {}, IMyListCreateBody>,
  res: Response<IMyListResponse>,
) => {
  const entry = await myListsService.insert(
    req.params.user_uuid,
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
    req.params.user_uuid,
    req.params.content_uuid,
  );

  res.status(200).json({
    success: true,
    message: "Content Removed from MyList Successfully.",
  });
};
