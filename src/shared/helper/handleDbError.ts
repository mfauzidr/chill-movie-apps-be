
import { Response } from "express";
import { getDbErrorMessage } from "./dbErrorMessage";

export const handlerDbError = (err: any, res: Response) => {
  switch (err.code) {
    case "ER_DUP_ENTRY":
    case "ER_BAD_NULL_ERROR":
    case "ER_DATA_TOO_LONG":
      return res.status(
        err.code === "ER_DUP_ENTRY" ? 409 : 400,
      ).json({
        success: false,
        message: getDbErrorMessage(err),
      });

    case "ER_NO_REFERENCED_ROW_2":
      return res.status(400).json({
        success: false,
        message: getDbErrorMessage(err),
      });

    case "ER_ROW_IS_REFERENCED_2":
      return res.status(409).json({
        success: false,
        message: getDbErrorMessage(err),
      });

    case "LIMIT_FILE_SIZE":
      return res.status(400).json({
        success: false,
        message: "File too large. Max 5MB.",
      });

    case "INVALID_FILE_TYPE":
      return res.status(400).json({
        success: false,
        message: "Invalid file type.",
      });

    default:
      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
  }
};
