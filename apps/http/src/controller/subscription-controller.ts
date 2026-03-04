import type { Request, Response } from "express";
import { client } from "@repo/db";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";

// Subscribe / Unsubscribe
export const toggleSubscription = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const subscriberId = req.userId;
            const targetCreatorId = req.params.creatorId;

            if (!targetCreatorId) {
                throw new AppError("Creator ID required", 400);
            }

            if (subscriberId === targetCreatorId) {
                throw new AppError("Can't subscribe to yourself", 400);
            }

            const existing = await client.subscription.findUnique({
                where: {
                    subscriberId_creatorId: {
                        subscriberId: subscriberId!,
                        creatorId: targetCreatorId as string,
                    }
                }
            });

            if (existing) {
                // Delete subscription
                await client.subscription.delete({
                    where: { id: existing.id }
                });
                return res.status(200).json({ success: true, isSubscribed: false, message: "Unsubscribed" });
            } else {
                // Create subscription
                await client.subscription.create({
                    data: {
                        subscriberId: subscriberId!,
                        creatorId: targetCreatorId as string,
                        status: "ACTIVE",
                        startDate: new Date(),
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    }
                });
                return res.status(200).json({ success: true, isSubscribed: true, message: "Subscribed" });
            }
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to toggle subscription", error: e });
        }
    }
);

// Check Subscription
export const checkSubscriptionStatus = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const subscriberId = req.userId;
            const targetCreatorId = req.params.creatorId;

            if (!targetCreatorId) {
                throw new AppError("Creator ID required", 400);
            }

            const existing = await client.subscription.findUnique({
                where: {
                    subscriberId_creatorId: {
                        subscriberId: subscriberId!,
                        creatorId: targetCreatorId as string,
                    }
                }
            });

            res.status(200).json({
                success: true,
                isSubscribed: !!existing,
            });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to check subscription", error: e });
        }
    }
);
