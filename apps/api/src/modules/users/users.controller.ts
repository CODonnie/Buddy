import { Response } from "express";
import { UsersService } from "./users.services";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";

export class UsersController {
    static me = asyncHandler(
        async (req: AuthRequest, res: Response) => {
            const user = await UsersService.getCurrentUser(req.user!.userId);

            res.status(200).json(user);
        });

    static updateProfile = asyncHandler(
        async (req: AuthRequest, res: Response) => {
            const user = await UsersService.updateProfile(
                req.user!.userId,
                req.body
            );

            res.status(200).json(user);
        });

    static changePassword = asyncHandler(
        async (req: AuthRequest, res: Response) => {
            const { currentPassword, newPassword } = req.body;

            const result = await UsersService.changePassword(
                req.user!.userId,
                currentPassword,
                newPassword
            );

            res.status(200).json(result);
        });
}