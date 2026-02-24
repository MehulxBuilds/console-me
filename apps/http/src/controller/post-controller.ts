import type { Request, Response } from "express";
import { client } from "@repo/db";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";
import { CreatorPostType } from "../types/index.js";

export const createPost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const creatorId = req.creatorId;

            const { success, data } = CreatorPostType.safeParse(req.body);

            if (!success) {
                throw new AppError("Invalid data", 400);
            }

            const create = await client.post.create({
                data: {
                    caption: data.caption!,
                    isLocked: data.isLocked!,
                    creatorId: creatorId!,
                    price: data.price!,
                    media: {
                        create: {
                            url: data.media_url,
                            type: data.media_type,
                        }
                    }
                }
            })

            if (!create) {
                throw new AppError("Failed to create post", 400);
            }

            res.status(200).json({
                success: true,
                message: "Posted successfully"
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
                message: "Failed to Update Profiles", e,
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
                message: "Failed to Update Profiles", e,
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
                message: "Failed to Update Profiles", e,
            });
        }
    }
);

export const fetchAllPost = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const creatorId = req.creatorId;

            const fetchpost = await client.post.findMany();

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
                message: "Failed to Update Profiles", e,
            });
        }
    }
);
