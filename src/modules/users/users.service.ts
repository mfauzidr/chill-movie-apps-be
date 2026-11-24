import { AppError } from "../../shared/helper/appError";
import { IUser, IUserBody } from "./users.model";
import * as usersRepository from "./users.repository";
import bcrypt from "bcrypt";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const findAll = async () => {
  const users = await usersRepository.findAll();

  return users;
};

export const findByUuid = async (uuid: string) => {
  const users = await usersRepository.findByUuid(uuid);

  return users;
};

export const insert = async (data: IUserBody) => {
  const { password, username, email } = data;

  const missingFields: string[] = [];

  if (!username?.trim()) {
    throw new AppError("MISSING_FIELD", "username cannot be empty", 400);
  }

  if (!email?.trim()) {
    throw new AppError("MISSING_FIELD", "email cannot be empty", 400);
  }

  if (!password) {
    throw new AppError("MISSING_FIELD", "password cannot be empty", 400);
  }

  if (!emailRegex.test(email.trim())) {
    throw new AppError("INVALID_EMAIL", "Invalid email format", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    ...data,
    username: username.trim(),
    email: email.trim(),
    password: hashedPassword,
  };

  return await usersRepository.insert(userData);
};

export const update = async (
  uuid: string,
  data: Partial<IUserBody>,
) => {
  // Validasi email hanya jika email ikut diubah
  if (data.email !== undefined) {
    if (!data.email.trim() || !emailRegex.test(data.email.trim())) {
      throw new AppError("INVALID_EMAIL", "Invalid email format", 400);
    }

    const existingUser = await usersRepository.findExsistingEmail(
      data.email.trim(),
      uuid,
    );

    if (existingUser.length > 0) {
      throw new AppError(
        "EMAIL_ALREADY_EXISTS",
        "Email already registered",
        409,
      );
    }

    data.email = data.email.trim();
  }

  // Lanjutkan proses hashing password dan validasi lainnya
  if (data.password !== undefined) {
    if (!data.password) {
      throw new AppError(
        "INVALID_PASSWORD",
        "Password cannot be empty",
        400,
      );
    }

    data.password = await bcrypt.hash(data.password, 10);
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("MISSING_FIELD", "No fields to update", 400);
  }

  return await usersRepository.update(uuid, data);
};

export const deleteUser = async (uuid: string) => {
  const affectedRows = await usersRepository.deleteUser(uuid);

  if (affectedRows === 0) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }
};
