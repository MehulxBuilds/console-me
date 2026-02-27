import type { Request, Response } from "express";
import { client } from "@repo/db";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";
import { CreatorPostType } from "../types/index.js";
import { getProducer } from "@repo/kafka";
import { getPostCache } from "@repo/cache";

export const createPost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const creatorId = req.creatorId;

            const { success, data } = CreatorPostType.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            const postId = crypto.randomUUID();
            const noftificationId = crypto.randomUUID();

            // const create = await client.post.create({
            //     data: {
            //         caption: data.caption!,
            //         isLocked: data.isLocked!,
            //         creatorId: creatorId!,
            //         price: data.price!,
            //         media: {
            //             create: {
            //                 url: data.media_url,
            //                 type: data.media_type,
            //             }
            //         }
            //     }
            // })

            const username = await client.creatorProfile.findUnique({
                where: {
                    id: creatorId,
                }
            })

            const create = getProducer().publishPost({
                id: postId,
                isLocked: data?.isLocked ?? false,
                caption: data.caption,
                createdAt: new Date(),
                creatorId: creatorId!,
                price: data.price,
                updatedAt: new Date(),
                media_type: data.media_url,
                media_url: data.media_url,
            })

            const notify = getProducer().publishNotification({
                id: noftificationId,
                createdAt: new Date(),
                isRead: false,
                type: "NEW_MESSAGE",
                updatedAt: new Date(),
                userId: userId!,
                message: "A new post is live",
                notifyLink: `/creator/${username?.username}/post/${postId}`,
                topic: "New Post",

            })

            // if (!create) {
            //     throw new AppError("Failed to create post", 400);
            // }

            res.status(200).json({
                success: true,
                message: "Posted successfully",
                postId: postId,
            })

        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to Update Profiles", e,
            });
        }
    }
);

export const updatePost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const creatorId = req.creatorId;
            const postId = req.params.postId;

            const { success, data } = CreatorPostType.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            if (!postId) {
                throw new AppError("PostId not found", 404);
            }

            const update = await client.post.update({
                where: {
                    id: postId as string ?? "",
                    creatorId: creatorId,
                },
                data: {
                    caption: data.caption!,
                    isLocked: data.isLocked!,
                    creatorId: creatorId!,
                    price: data.price!,
                }
            })

            if (!update) {
                throw new AppError("Failed to update post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted updated successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to Update Post", e,
            });
        }
    }
);

export const deletePost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const creatorId = req.creatorId;
            const postId = req.params.postId;

            const deletepost = await client.post.delete({
                where: {
                    id: postId as string ?? "",
                    creatorId: creatorId,
                }
            })

            if (!deletepost) {
                throw new AppError("Failed to delete post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted deleted successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to delete Post", e,
            });
        }
    }
);

export const fetchPost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const creatorId = req.creatorId;
            const postId = req.params.postId;

            const fetchpost = await client.post.findFirst({
                where: {
                    id: postId as string ?? "",
                    creatorId: creatorId,
                }
            })

            if (!fetchpost) {
                throw new AppError("Failed to fetch post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted fetched successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to fetch Post", e,
            });
        }
    }
);

export const fetchAllPost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const creatorId = req.creatorId;
            const creatorPostCacheKey = `creator:${creatorId}:posts:initial`;
            let fetchpost;

            const postCache = getPostCache();
            fetchpost = await postCache.getPost(creatorPostCacheKey);

            if (!fetchpost) {
                fetchpost = await client.post.findMany({
                    where: {
                        creatorId: creatorId,
                    }
                });

                await postCache.addPost(creatorPostCacheKey, fetchpost);
            }

            if (!fetchpost) {
                throw new AppError("Failed to fetch post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted fetched successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to fetch Posts", e,
            });
        }
    }
);

export const getFeedPost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const feedCacheKey = `feed:${userId}:initial`;

            let feedpost;

            const postCache = getPostCache();
            feedpost = await postCache.getPost(feedCacheKey);

            if (!feedpost) {
                feedpost = await client.post.findMany({
                    take: 20
                });

                await postCache.addPost(feedCacheKey, feedpost)
            }

            if (!feedpost) {
                throw new AppError("Failed to fetch post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted fetched successfully"
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to Update Profiles", e,
            });
        }
    }
);