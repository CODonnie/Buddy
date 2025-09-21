import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { signUpSchema, loginSchema } from '../validators/authValidators';
import { PrismaClient } from '../generated/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const generateToken = (id: string, email: string) => {
    return jwt.sign({ id, email}, process.env.JWT_SECRET as string, { expiresIn: '1d'});
}

export const signup = async (req: Request, res: Response) => {
    try {
        const parsed = signUpSchema.safeParse(req.body);
        if(!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

        const { name, email, password } = parsed.data;

        const existingUser = await prisma.user.findUnique({ where: { email} });
        if (existingUser) return res.status(400).json({ error: "User already exists"});

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
        });

        const token = generateToken(user.id, user.email);

        res.status(201).json({
            message: " user created successfully",
            user: { id: user.id, name: user.name, email: user.email },
            token,
        })
    } catch(error){
        console.log(`sign up error - ${error}`);
        res.status(500).json({error: "Internal server error"});
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if(!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) return res.status(404).json({ error: "user doesn't exists"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(403).json({ error: "Invalid credentials"});

        const token = generateToken(user.id, user.email);

        res.cookie("userToken", token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
            maxAge: 1 * 24 * 3600 * 1000,
        });

        res.status(200).json({
            message: "User Login successfully",
            user: { id: user.id, name: user.name, email: user.email},
            token,
        });
    } catch(error){
        console.log(`Login error - ${error}`);
        res.status(500).json({error: "Internal server error"});
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie("userToken", {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "User logged out successfully"});
}

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized"});

        const user = await prisma.user.findUnique({ where: { id: req.user.id }});
        if (!user) return res.status(404).json({ error: "User not found"});

        res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }});
    }catch (error) {
        console.log(`Get user error - ${error}`);
        res.status(500).json({ error: "Internal server error"});
    }
}