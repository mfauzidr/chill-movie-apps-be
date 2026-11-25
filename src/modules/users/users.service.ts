import { AppError } from "../../shared/helper/appError";
import { IUserBody } from "./users.model";
import * as usersRepository from "./users.repository";
import bcrypt from "bcrypt";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const findAll = async () => {
  return await usersRepository.findAll();
};

export const findByUuid = async (uuid: string) => {
  return await usersRepository.findByUuid(uuid);
};

export const insert = async (data: IUserBody) => {
  // 1. Whitelist validation
  const allowedFields = [
    "username",
    "email",
    "password",
    "role",
    "image",
    "is_active",
  ];

  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    throw new AppError(
      "INVALID_FIELD",
      `Invalid fields: ${invalidFields.join(", ")}`,
      400,
    );
  }

  const { password, username, email } = data;

  // 2. Required field validation
  if (typeof username !== "string" || !username.trim()) {
    throw new AppError(
      "INVALID_USERNAME",
      "Username must be a non-empty string",
      400,
    );
  }

  if (typeof email !== "string" || !email.trim()) {
    throw new AppError(
      "INVALID_EMAIL",
      "Email must be a non-empty string",
      400,
    );
  }

  if (typeof password !== "string" || !password.trim()) {
    throw new AppError(
      "INVALID_PASSWORD",
      "Password must be a non-empty string",
      400,
    );
  }

  // 3. Email format validation
  if (!emailRegex.test(email.trim())) {
    throw new AppError("INVALID_EMAIL", "Invalid email format", 400);
  }

  // 4. Duplicate email validation
  const existingUser = await usersRepository.findExistingEmail(email.trim());

  if (existingUser.length > 0) {
    throw new AppError("EMAIL_ALREADY_EXISTS", "Email already registered", 409);
  }

  // 5. Password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // 6. Prepare data
  const userData = {
    ...data,
    username: username.trim(),
    email: email.trim(),
    password: hashedPassword,
  };

  return await usersRepository.insert(userData);
};

export const update = async (uuid: string, data: Partial<IUserBody>) => {
  // 1. Whitelist validation
  const allowedFields = [
    "username",
    "email",
    "password",
    "role",
    "image",
    "is_active",
  ];

  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    throw new AppError(
      "INVALID_FIELD",
      `Invalid fields: ${invalidFields.join(", ")}`,
      400,
    );
  }

  // 2. Empty payload validation
  if (Object.keys(data).length === 0) {
    throw new AppError("MISSING_FIELD", "No fields to update", 400);
  }

  // 3. Username validation
  if (data.username !== undefined) {
    if (typeof data.username !== "string" || !data.username.trim()) {
      throw new AppError(
        "INVALID_USERNAME",
        "Username must be a non-empty string",
        400,
      );
    }

    data.username = data.username.trim();
  }

  // 4. Email validation
  if (data.email !== undefined) {
    if (typeof data.email !== "string" || !data.email.trim()) {
      throw new AppError(
        "INVALID_EMAIL",
        "Email must be a non-empty string",
        400,
      );
    }

    if (!emailRegex.test(data.email.trim())) {
      throw new AppError("INVALID_EMAIL", "Invalid email format", 400);
    }

    const existingUser = await usersRepository.findExistingEmail(
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

  // 5. Password validation and hashing
  if (data.password !== undefined) {
    if (typeof data.password !== "string" || !data.password.trim()) {
      throw new AppError(
        "INVALID_PASSWORD",
        "Password must be a non-empty string",
        400,
      );
    }

    data.password = await bcrypt.hash(data.password, 10);
  }

  // 6. Repository update
  return await usersRepository.update(uuid, data);
};

export const deleteUser = async (uuid: string) => {
  const affectedRows = await usersRepository.deleteUser(uuid);

  if (affectedRows === 0) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }
};
