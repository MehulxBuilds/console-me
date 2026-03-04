import type { Request, Response } from "express";
import { client } from "@repo/db";
import { catchAsync } from "../utils/catch-async.js";
import { AppError } from "../utils/app-error.js";
import type { AuthRequest } from "../middleware/user-middleware.js";
import { getProducer } from "@repo/kafka";

// Fetch conversations
export const getConversations = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!;

            // Get all messages where user is sender or receiver
            const messages = await client.message.findMany({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    sender: {
                        select: { id: true, name: true, image: true, creatorProfile: { select: { username: true } } }
                    },
                    receiver: {
                        select: { id: true, name: true, image: true, creatorProfile: { select: { username: true } } }
                    }
                }
            });

            // Extract unique conversations
            const conversationsMap = new Map();

            for (const msg of messages) {
                const isSender = msg.senderId === userId;
                const otherUser = isSender ? msg.receiver : msg.sender;

                if (!conversationsMap.has(otherUser.id)) {
                    conversationsMap.set(otherUser.id, {
                        user: {
                            id: otherUser.id,
                            name: otherUser.name,
                            image: otherUser.image,
                            username: otherUser.creatorProfile?.username || "user",
                        },
                        lastMessage: msg.content,
                        lastMessageAt: msg.createdAt,
                        unreadCount: (!isSender && !msg.isRead) ? 1 : 0
                    });
                } else if (!isSender && !msg.isRead) {
                    const conv = conversationsMap.get(otherUser.id);
                    conv.unreadCount += 1;
                }
            }

            const conversations = Array.from(conversationsMap.values());

            res.status(200).json({
                success: true,
                data: conversations
            });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to fetch conversations", error: e });
        }
    }
);

// Fetch message history with a specific user
export const getMessageHistory = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!;
            const otherUserId = req.params.userId;

            if (!otherUserId) {
                throw new AppError("Other User ID required", 400);
            }

            const messages = await client.message.findMany({
                where: {
                    OR: [
                        { senderId: userId, receiverId: otherUserId as string },
                        { senderId: otherUserId as string, receiverId: userId }
                    ]
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });

            // Mark unread messages as read
            const unreadMessageIds = messages
                .filter(m => m.receiverId === userId && !m.isRead)
                .map(m => m.id);

            if (unreadMessageIds.length > 0) {
                await client.message.updateMany({
                    where: { id: { in: unreadMessageIds } },
                    data: { isRead: true }
                });
            }

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to fetch messages", error: e });
        }
    }
);

// Send message
export const sendMessage = catchAsync(
    async (req: AuthRequest, res: Response) => {
        try {
            const senderId = req.userId!;
            const { receiverId, content } = req.body;

            if (!receiverId || !content) {
                throw new AppError("Receiver ID and content are required", 400);
            }

            const messageId = crypto.randomUUID();;
            // conversationId logic to match WS expectations (string combination)
            const conversationId = [senderId, receiverId].sort().join('-');
            let kafkaMessage;

            try {
                // Publish to Kafka for real-time delivery via WebSockets
                kafkaMessage = {
                    id: messageId,
                    conversationId,
                    senderId,
                    receiverId,
                    content: content || "",
                    createdAt: new Date(),
                };
                await getProducer().publishDMChatMessage(kafkaMessage);
            } catch (err) {
                console.warn("Failed to publish DM to Kafka:", err);
            }

            res.status(201).json({
                success: true,
                data: kafkaMessage,
            });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message || "Failed to send message", error: e });
        }
    }
);
