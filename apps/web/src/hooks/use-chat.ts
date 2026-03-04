import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export interface Conversation {
    user: {
        id: string;
        name: string;
        image: string | null;
        username: string;
    };
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    isLocked: boolean;
    price: number | null;
    isRead: boolean;
    createdAt: string;
}

const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await fetch(`${API_BASE}/api/v1/message/conversations`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch conversations");
    }

    const result = await response.json();
    return result.data;
};

const fetchMessageHistory = async (userId: string): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_BASE}/api/v1/message/history/${userId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch message history");
    }

    const result = await response.json();
    return result.data;
};

const sendChatMessage = async (data: { receiverId: string; content: string; isLocked?: boolean; price?: number }): Promise<ChatMessage> => {
    const response = await fetch(`${API_BASE}/api/v1/message/send`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    const result = await response.json();
    return result.data;
};

export const useConversations = () => {
    return useQuery({
        queryKey: ["chat", "conversations"],
        queryFn: fetchConversations,
    });
};

export const useMessageHistory = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["chat", "history", userId],
        queryFn: () => fetchMessageHistory(userId!),
        enabled: !!userId,
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sendChatMessage,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["chat", "history", variables.receiverId] });
            queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
        },
    });
};
