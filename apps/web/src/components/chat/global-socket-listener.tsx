"use client";

import { useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useQueryClient } from "@tanstack/react-query";
import { useMeQuery } from "@/hooks/use-me-query";
import type { ChatMessage } from "@/hooks/use-chat";

export function GlobalSocketListener() {
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const { data: meData } = useMeQuery(true);

    useEffect(() => {
        if (!socket || !meData?.user?.id) return;

        const currentUserId = meData.user.id;

        const handleNewMessage = (msg: any) => {
            console.log("[GlobalSocketListener] dm-message received:", msg);

            // Determine the other user's ID for the chat history query key
            const otherUserId = msg.senderId === currentUserId
                ? msg.receiverId
                : msg.senderId;

            // Optimistically insert the message into the chat history cache
            queryClient.setQueryData<ChatMessage[]>(
                ["chat", "history", otherUserId],
                (oldMessages) => {
                    if (!oldMessages) return oldMessages;

                    // Avoid duplicates (e.g. if the sender already added it locally)
                    if (oldMessages.some((m) => m.id === msg.id)) {
                        return oldMessages;
                    }

                    const newMessage: ChatMessage = {
                        id: msg.id,
                        senderId: msg.senderId,
                        receiverId: msg.receiverId,
                        content: msg.content,
                        isLocked: msg.isLocked ?? false,
                        price: msg.price ?? null,
                        isRead: msg.isRead ?? false,
                        createdAt: msg.createdAt,
                    };

                    return [...oldMessages, newMessage];
                }
            );

            // Also refresh the conversations sidebar for last message / unread count
            queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
        };

        socket.on("dm-message", handleNewMessage);

        return () => {
            socket.off("dm-message", handleNewMessage);
        };
    }, [socket, queryClient, meData?.user?.id]);

    return null; // This component just manages the connection and events
}
