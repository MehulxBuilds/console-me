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
            //         id: postId,
            //         caption: data.caption || "",
            //         isLocked: data.isLocked || false,
            //         creatorId: userId!, // Use User ID to match schema
            //         price: data.price || 0,
            //         ...(data.media_url && data.media_type ? {
            //             media: {
            //                 create: {
            //                     url: data.media_url,
            //                     type: data.media_type,
            //                 }
            //             }
            //         } : {})
            //     }
            // });

            const username = await client.creatorProfile.findUnique({
                where: {
                    id: creatorId,
                }
            });

            // Invalidate cache immediately
            const postCache = getPostCache();
            const creatorPostCacheKey = `creator:${userId}:posts:initial`;
            await postCache.invalidatePost(creatorPostCacheKey);
            await postCache.invalidateByPattern("feed:*:initial");

            // Still publish to Kafka for notifications and other services if needed
            try {
                const create = getProducer().publishPost({
                    id: postId,
                    isLocked: data?.isLocked ?? false,
                    caption: data.caption,
                    createdAt: new Date(),
                    creatorId: userId ?? "",
                    price: data.price,
                    updatedAt: new Date(),
                    media_type: data?.media_type!,
                    media_url: data?.media_url!,
                })

                await getProducer().publishNotification({
                    id: noftificationId,
                    createdAt: new Date(),
                    isRead: false,
                    type: "NEW_MESSAGE",
                    updatedAt: new Date(),
                    userId: userId!,
                    message: "A new post is live",
                    notifyLink: `/creator/${username?.username}/post/${postId}`,
                    topic: "New Post",
                });
            } catch (kafkaError) {
                console.warn("Kafka notification failed, but post was created:", kafkaError);
            }

            res.status(200).json({
                success: true,
                message: "Posted successfully",
                postId: postId,
                data: {},
            });

        } catch (e) {
            console.error(`Error in createPost: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to create post",
                error: String(e),
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
                message: "Posted fetched successfully",
                data: fetchpost,
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
            const { creatorId: paramId } = req.params;
            if (!paramId) {
                throw new AppError("Creator ID is required", 400);
            }

            // Check if paramId is a CreatorProfile ID or User ID
            // In the existing schema, Post.creatorId is a User ID.
            // But frontend might send the CreatorProfile ID.
            const profile = await client.creatorProfile.findUnique({
                where: { id: paramId as string }
            });

            const targetUserId = profile ? profile.userId : paramId;

            const creatorPostCacheKey = `creator:${targetUserId}:posts:initial`;
            let fetchpost;

            const postCache = getPostCache();
            fetchpost = await postCache.getPost(creatorPostCacheKey);

            if (!fetchpost) {
                fetchpost = await client.post.findMany({
                    where: {
                        creatorId: targetUserId as string,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        media: true,
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                creatorProfile: {
                                    select: {
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                });

                // Map to frontend expected structure
                fetchpost = fetchpost.map(post => ({
                    ...post,
                    media_url: post.media[0]?.url,
                    media_type: post.media[0]?.type,
                    author: {
                        id: post.creator.id,
                        name: post.creator.name,
                        image: post.creator.image,
                        username: post.creator.creatorProfile?.username || "user"
                    }
                }));

                await postCache.addPost(creatorPostCacheKey, fetchpost);
            }

            if (!fetchpost) {
                throw new AppError("Failed to fetch post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted fetched successfully",
                data: fetchpost,
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
                    take: 20,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        media: true,
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                creatorProfile: {
                                    select: {
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                });

                // Map to frontend expected structure
                feedpost = feedpost.map(post => ({
                    ...post,
                    media_url: post.media[0]?.url,
                    media_type: post.media[0]?.type,
                    author: {
                        id: post.creator.id,
                        name: post.creator.name,
                        image: post.creator.image,
                        username: post.creator.creatorProfile?.username || "user"
                    }
                }));

                await postCache.addPost(feedCacheKey, feedpost);
            }

            if (!feedpost) {
                throw new AppError("Failed to fetch post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted fetched successfully",
                data: feedpost,
            })
        } catch (e) {
            console.error(`Error: ${e}`);
            res.status(500).json({
                success: false,
                message: "Failed to fetch feed posts", e,
            });
        }
    }
);