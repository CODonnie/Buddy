import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";


export class AuthController {
    static register = asyncHandler (async(req, res: Response) => {
        const { name, email, password } = req.body;

        const user = await AuthService.register( name, email, password );

        res.status(201).json({
            message: "User created successfully",
            user,
        });
    });

    static login = asyncHandler (async (req, res: Response) => {
        const { email, password } = req.body;

        const data = await AuthService.login( email, password );

        res.status(200).json(data);
    });

    static me = asyncHandler (async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;

        const user = await AuthService.getCurrentUser( userId! );

        res.status(200).json(user);
    });
}