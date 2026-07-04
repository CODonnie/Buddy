import { Response } from "express";
import { UsersService } from "./users.services";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { sendResponse } from "../../shared/utils/send-response";

export class UsersController {
    static me = asyncHandler(
        async (req: AuthRequest, res: Response) => {
            const user = await UsersService.getCurrentUser(req.user!.userId);

            sendResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "User fetched successfully",
                data: user,
            });
        });

    static updateProfile = asyncHandler(
        async (req: AuthRequest, res: Response) => {
            const user = await UsersService.updateProfile(
                req.user!.userId,
                req.body
            );

            sendResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "User updated successfully",
                data: user,
            });
        });

    static changePassword = asyncHandler(
        async (req: AuthRequest, res: Response) => {
            const { currentPassword, newPassword } = req.body;

            const result = await UsersService.changePassword(
                req.user!.userId, {
                currentPassword,
                newPassword
            }
            );

            sendResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "User's password changed successfully",
            });
        });
}