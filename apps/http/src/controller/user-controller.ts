import type { Request, Response } from "express";
import { client } from "@repo/db";
import { Role } from "@repo/db/values";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";
import { UsernameType, UserProfileUpdate } from "../types/index.js";

export const claimUsername = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const user = req.user;

            const { success, data } = UsernameType.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            const isExist = await client.creatorProfile.findUnique({
                where: {
                    username: data?.username
                }
            });

            if (isExist) {
                res.status(409).json({
                    success: false,
                    message: "Username Already Exist",
                })
            };

            await client.$transaction(async (tx) => {
                const existing = await tx.creatorProfile.findUnique({
                    where: { userId }
                });

                if (!existing) {
                    await tx.user.update({
                        where: { id: userId },
                        data: { role: Role.CREATOR }
                    });
                }

                return tx.creatorProfile.upsert({
                    where: { userId },
                    update: {
                        username: data.username
                    },
                    create: {
                        userId: userId!,
                        username: data.username!,
                        payoutEmail: user.email
                    }
                });
            });

            res.status(200).json({
                success: true,
                message: "Username Claimed Successfully",
            });
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Internal Server Error", e,
            });
        }
    }
);

export const checkAvailaible = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const { success, data } = UsernameType.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            const isExist = await client.creatorProfile.findUnique({
                where: {
                    username: data?.username
                }
            });

            if (isExist) {
                res.status(409).json({
                    success: false,
                    message: "Username Already Exist",
                })
            };

            res.status(201).json({
                success: true,
                message: "Username Ready to claim",
            });
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Internal Server Error", e,
            });
        }
    }
);

export const deleteUserProfile = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            const deleteAcc = await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                    isActive: false,
                }
            })

            if (!deleteAcc) {
                throw new AppError("Account deletion failed", 400);
            }

            res.status(201).json({
                success: true,
                message: "User Disabled Successfully",
            });
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Internal Server Error", e,
            });
        }
    }
);

export const updateUserProfile = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const { success, data } = UserProfileUpdate.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            const update = await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                    ...data
                }
            });

            if (!update) {
                throw new AppError("Account Updation failed", 400);
            }

            res.status(201).json({
                success: true,
                message: "User Profile Updation Successfully",
            });
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Internal Server Error", e,
            });
        }
    }
);