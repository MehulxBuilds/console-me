import type { Request, Response } from "express";
import { client, Role } from "@repo/db";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";
import { CreatorProfileUpdate } from "../types/index.js";

export const createProfile = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const user = req.user;

            await client.$transaction(async (tx) => {
                await tx.user.update({
                    where: { id: userId },
                    data: { role: "CREATOR" }
                });

                await tx.creatorProfile.create({
                    data: {
                        userId: userId!,
                        payoutEmail: user.email
                    }
                });
            });

            res.status(200).json({
                success: true,
                message: "Profiles fetched successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to fetched Profiles", e,
            });
        }
    }
);

export const updateProfile = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const { success, data } = CreatorProfileUpdate.safeParse(req.body);

            if(!success) {
                throw new AppError("Invalid data", 400);
            }

            const update = await client.creatorProfile.update({
                where: {
                    userId: userId
                },
                data: {
                    ...data
                }
            });

            if (!update) {
                throw new AppError("Profile update failed", 400);
            }

            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: update
            });

        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to Update Profiles", e,
            });
        }
    }
);

export const switchProfile = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            const switchprofile = await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                    role: "USER" as Role,
                }
            });

            if (!switchprofile) {
                throw new AppError("Switch Profile operation failed", 400);
            }

            res.status(200).json({
                success: true,
                message: "Profiles Switched successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to Switch Account Profiles", e,
            });
        }
    }
);

export const fetchProfile = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            const creatorProfiles = await client.creatorProfile.findMany({
                where: {
                    userId: userId,
                },
                select: {
                    id: true,
                    subscriptionPrice: true,
                    user: true,
                    createdAt: true,
                }
            });

            if (!creatorProfiles) {
                throw new AppError("Profile fetch failed", 400);
            }

            res.status(200).json({
                success: true,
                message: "Profiles fetched successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to fetched Profiles", e,
            });
        }
    }
);

export const fetchAllProfile = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const creatorProfiles = await client.creatorProfile.findMany({
                select: {
                    id: true,
                    subscriptionPrice: true,
                    user: true,
                    createdAt: true,
                }
            });

            if (!creatorProfiles) {
                throw new AppError("Profile fetch failed", 400);
            }

            res.status(200).json({
                success: true,
                message: "Profiles fetched successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to fetched Profiles", e,
            });
        }
    }
);