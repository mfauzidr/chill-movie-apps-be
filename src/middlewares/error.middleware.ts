import { AppError } from "../../src/shared/helper/appError";
import { handlerDbError } from "../../src/shared/helper/handleDbError";
import { logger } from "../../src/shared/logger/logger";
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error({
    message: err.message,
    code: err.code,
    name: err.name,
    stack: err.stack,
    httpStatusCode: err.httpStatusCode,
    apiResponse: err.ApiResponse,
    path: req.originalUrl,
    method: req.method,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code) {
    return handlerDbError(err, res);
  }

  if (
    err instanceof SyntaxError &&
    "status" in err &&
    err.status === 400 &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
