import type { Request, Response } from "express";
import { client } from "@repo/db";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";
import { MarkingNotificationReadType } from "../types/index.js";
import { getNotificationCache } from "@repo/cache";

export const markAsReadNotification = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const notificationCache = getNotificationCache();
            const notificationCacheKey = `notification:${userId}:initial`;
            const { data, success } = MarkingNotificationReadType.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            const markAsRead = await client.notification.updateMany({
                where: {
                    userId: userId,
                    id: { in: data.notificationIds.map((n) => n.id) }
                },
                data: {
                    isRead: true,
                }
            });

            if (!markAsRead) {
                throw new AppError("Failed to mark post as read post", 400);
            }

            await notificationCache.invalidateNotification(notificationCacheKey);

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
            const notificationCache = getNotificationCache();
            const notificationCacheKey = `notification:${userId}:initial`;

            let notification;
            notification = await notificationCache.getNotification(notificationCacheKey);

            if (!notification) {
                notification = await client.notification.findMany({
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

                await notificationCache.addNotification(notificationCacheKey, notification);
            }


            if (!notification) {
                throw new AppError("Failed to fetch post", 400);
            }

            res.status(201).json({
                success: true,
                message: "post fetched successfully",
                notifications: notification,
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