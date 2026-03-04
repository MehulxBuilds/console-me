import { client } from "@repo/db";
import { catchAsync } from "../utils/catch-async";
import { AuthRequest } from "../middleware/user-middleware";
import { Response } from "express";
import { FollowCreator } from "../types";
import { AppError } from "../utils/app-error";

export const followCreator = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const { data, success } = FollowCreator.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            const { followerId, followingId } = data;

            if (followerId === followingId) {
                throw new Error("You cannot follow yourself");
            }

            const existingFollow = await client.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId,
                    },
                },
            });

            // UNFOLLOW
            if (existingFollow) {
                await client.$transaction([
                    client.follow.delete({
                        where: {
                            followerId_followingId: {
                                followerId,
                                followingId,
                            },
                        },
                    }),

                    client.user.update({
                        where: { id: followerId },
                        data: {
                            followingCount: {
                                decrement: 1,
                            },
                        },
                    }),

                    client.user.update({
                        where: { id: followingId },
                        data: {
                            followersCount: {
                                decrement: 1,
                            },
                        },
                    }),
                ]);

                return { following: false };
            }

            // FOLLOW
            await client.$transaction([
                client.follow.create({
                    data: {
                        followerId,
                        followingId,
                    },
                }),

                client.user.update({
                    where: { id: followerId },
                    data: {
                        followingCount: {
                            increment: 1,
                        },
                    },
                }),

                client.user.update({
                    where: { id: followingId },
                    data: {
                        followersCount: {
                            increment: 1,
                        },
                    },
                }),
            ]);

            res.status(200).json({ success: true });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to follow creator", error: e });
        }
    }
)