import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";


export class AuthController {
    static register = asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;

        const user = await AuthService.register(name, email, password);

        res.status(201).json({
            message: "User created successfully",
            user,
        });
    });

    static async login(req: Request, res: Response) {
        try {
            const parsed = loginSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(400).json({
                    errors: parsed.error.format(),
                });
            }

            const { email, password } = parsed.data;

            const data = await AuthService.login(email, password);

            res.status(200).json(data);
        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    static async me(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Unathorized"
                });
            };

            const user = await AuthService.getCurrentUser(userId);

            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            })
        }
    }
}