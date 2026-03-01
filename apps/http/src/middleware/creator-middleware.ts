import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { client, Role } from "@repo/db";
import { auth } from "@repo/auth";
import { fromNodeHeaders } from "better-auth/node";
import { AuthRequest } from "./user-middleware.js";

export const protectCreator = async (
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
            where: { id: session.user.id },
            include: {
                creatorProfile: true,
            }
        });

        if (user?.role !== "CREATOR" as Role) {
            throw new AppError("User is Not as Creator", 404);
        }

        req.creatorId = user.creatorProfile?.id!;

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

export const authenticate = protectCreator;