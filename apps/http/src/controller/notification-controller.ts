import type { Request, Response } from "express";
import { client } from "@repo/db";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";

export const markAsReadNotification = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            const markAsRead = await client.notification.updateMany({
                where: {
                    userId: userId,
                },
                data: {
                    isRead: true,
                }
            });

            if (!markAsRead) {
                throw new AppError("Failed to mark post as read post", 400);
            }

            res.status(201).json({
                success: true,
                message: "post marked as read successfully",
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to Mark Post As Read Notification", e,
            });
        }
    }
);

export const fetchAllNotification = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            const post = await client.notification.findMany({
                where: {
                    userId: userId,
                    isRead: false,
                },
                select: {
                    id: true,
                    type: true,
                    topic: true,
                    notifyLink: true,
                    message: true,
                    createdAt: true,
                }
            });

            if (!post) {
                throw new AppError("Failed to fetch post", 400);
            }

            res.status(201).json({
                success: true,
                message: "post fetched successfully",
                post: post,
            })

        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to fetch notification", e,
            });
        }
    }
)