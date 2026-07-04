import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppErrors";
import { HTTP_STATUS } from "../constants/http-status";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  logger.error({
    error,
    path: req.originalUrl,
    method: req.method,
  },
  "Unhandled error"
);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
  });
};