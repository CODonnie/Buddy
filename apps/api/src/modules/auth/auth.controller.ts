import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";


export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const parsed = registerSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(400).json({
                    errors: parsed.error.format(),
                });
            }

            const { name, email, password } = parsed.data;

            const user = await AuthService.register(name, email, password);

            res.status(201).json({
                message: "user created successfully",
                user
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    }

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
}