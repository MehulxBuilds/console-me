import type { Request, Response } from "express";
import { client } from "@repo/db";
import { Role } from "@repo/db/values";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";
import { UsernameType, UserProfileUpdate } from "../types/index.js";
import { getProducer } from "@repo/kafka";

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

            const noftificationId = crypto.randomUUID();

            const notify = getProducer().publishNotification({
                id: noftificationId,
                createdAt: new Date(),
                isRead: false,
                type: "NEW_MESSAGE",
                updatedAt: new Date(),
                userId: userId!,
                message: "Profile Created Successfully",
                notifyLink: `/creator/${data?.username}`,
                topic: "Creator Profile",
            })

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

export const fetchUserById = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const user = await client.user.findUnique({
                where: { id: req.params.id as string },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    creatorProfile: { select: { username: true } }
                }
            });

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const formattedUser = {
                id: user.id,
                name: user.name,
                image: user.image,
                username: user.creatorProfile?.username || ""
            };

            res.status(200).json({ success: true, data: formattedUser });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to fetch user", error: e });
        }
    }
);

export const searchUsers = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const query = req.query.q as string;
            if (!query) {
                return res.status(200).json({ success: true, data: [] });
            }

            const users = await client.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        {
                            creatorProfile: {
                                username: { contains: query, mode: "insensitive" }
                            }
                        }
                    ],
                    id: { not: req.userId } // Don't return self
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    creatorProfile: {
                        select: {
                            username: true
                        }
                    }
                },
                take: 10
            });

            // Map the result to match the expected frontend interface
            const formattedUsers = users.map(u => ({
                id: u.id,
                name: u.name,
                image: u.image,
                username: u.creatorProfile?.username || "" // Fallback if no creator profile
            }));

            res.status(200).json({ success: true, data: formattedUsers });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to search users", error: e });
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