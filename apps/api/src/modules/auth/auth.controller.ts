import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { sendResponse } from "../../shared/utils/send-response";

export class AuthController {
    static register = asyncHandler(async (req, res: Response) => {
        const { name, email, password } = req.body;

        const user = await AuthService.register(name, email, password);

        sendResponse({
            res,
            statusCode: HTTP_STATUS.CREATED,
            message: "User created successfully",
            data: user,
        });
    });

    static login = asyncHandler(async (req, res: Response) => {
        const { email, password } = req.body;

        const data = await AuthService.login(email, password);

        sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message: "Login successful",
            data,
        });
    });

    static me = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;

        const user = await AuthService.getCurrentUser(userId!);

        sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message: "Current user retrieved successfully",
            data: user,
        });
    });
}
