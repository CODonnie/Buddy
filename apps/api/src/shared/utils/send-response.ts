import { Response } from "express";

type SendResponseOptions<T> = {
    res: Response;
    statusCode: number;
    message: string;
    data?: T;
};


export function sendResponse<T>({
    res, statusCode, message, data,
}: SendResponseOptions<T>) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}