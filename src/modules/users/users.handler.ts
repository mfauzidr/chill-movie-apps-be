import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUserResponse } from "../../shared/models/response.model";
import { findAll, findByUuid, insert, update, deleteUser } from "./users.service";
import { AppError } from "../../shared/helper/appError";
import { IUserBody, IUserParams } from "./users.model";

export const getAllUsers = async (
  req: Request,
  res: Response<IUserResponse>,
) => {
  const users = await findAll();

  if (users.length < 1) {
    throw new AppError("NOT_DATA", "No Data Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Users Retrieved Successfully.",
    results: users,
  });
};

export const getUserByUuid = async (
  req: Request<IUserParams>,
  res: Response<IUserResponse>,
) => {
  const { uuid } = req.params;
  const user = await findByUuid(uuid);

  if (!user) {
    throw new AppError("NOT_DATA", "No Data Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User Retrieved Successfully.",
    results: user,
  });
};

export const insertUser = async (
  req: Request<{}, {}, IUserBody>,
  res: Response<IUserResponse>,
) => {
  const user = await insert(req.body);

  return res.status(201).json({
    success: true,
    message: "User Created Successfully.",
    results: user,
  });
};


export const updateUser = async (
  req: Request<{ uuid: string }, {}, Partial<IUserBody>>,
  res: Response<IUserResponse>,
): Promise<Response> => {
  const { uuid } = req.params;

  if (!uuid) {
    throw new AppError("NO_ID", "UUID must be provided", 400);
  }

  const user = await update(uuid, req.body);

  if (user.length === 0) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    results: user,
  });
};


export const deleteUsers = async (
  req: Request<{uuid: string}>,
  res: Response<IUserResponse>
):Promise<Response> => {
  const {uuid} = req.params
  if (!uuid || uuid === ":uuid") {
    throw new AppError("NO_ID", "UUID must be provided", 400);
  }

  await deleteUser(uuid)

  return res.json({
    success: true,
    message: "User deleted successfully"
  });
}