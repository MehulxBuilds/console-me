import { client } from "@repo/db";
import { AuthRequest } from "../middleware/user-middleware";
import { catchAsync } from "../utils/catch-async";
import { Response } from "express";

export const likePost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const postId = req.params.postId as string;

            if (!postId || typeof postId !== "string") {
                return res.status(400).json({ success: false, message: "Invalid postId" });
            }

            const existingLike = await client.like.findUnique({
                where: {
                    postId_userId: {
                        postId: postId,
                        userId: userId!,
                    },
                },
            });

            // If already liked → unlike
            if (existingLike) {
                await client.like.delete({
                    where: {
                        postId_userId: {
                            postId,
                            userId: userId!,
                        },
                    },
                });

                return { liked: false };
            }

            // Otherwise → like
            await client.like.create({
                data: {
                    postId,
                    userId: userId!,
                },
            });

            res.status(200).json({ success: true });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to like post", error: e });
        }
    }
);