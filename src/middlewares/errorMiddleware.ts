// middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma";


export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Something went wrong";

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 400;
                message = "Duplicate value for a unique field (e.g., email already exists)";
                break;
            case "P2025":
                statusCode = 404;
                message = "Record not found";
                break;
            default:
                message = `Database error: ${err.code}`;
        }
    }

    // Prisma Validation Errors
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid data sent to the database";
    }

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
