import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: any
};

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.userToken || req.headers?.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorised: missing token"});
    try {
        const decoded = jwt.verify(token, secret!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Forbidden: Invalid or expired token"});
    }
} 