import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;
if(!secret) throw new Error ("JWT_SECRET not configured");

interface JwtPayload {
    userId: string
}

export interface AuthRequest extends Request {
    user?: JwtPayload
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Missing authorization token"
            })
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.user = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    };
}