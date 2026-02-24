import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { client } from "@repo/db";
import { auth } from "@repo/auth";
import { fromNodeHeaders } from "better-auth/node";

export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
    creatorId?: string;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session?.session?.token) {
            throw new AppError("Not authorized. Please login.", 401);
        }

        // Get user from database
        const user = await client.user.findUnique({
            where: { id: session.user.id! },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                banner: true,
                bio: true,
                role: true,
                isActive: true,
            },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        req.userId = user.id;
        req.user = user;
        next();
    } catch (error: any) {
        if (error.name === "JsonWebTokenError") {
            return next(new AppError("Invalid token", 401));
        }
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Token expired", 401));
        }
        next(error);
    }
};

export const authenticate = protect;