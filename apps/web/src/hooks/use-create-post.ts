import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_BASE } from "@/utils/constants";

export interface CreatePostData {
    caption?: string;
    media_url?: string;
    media_type?: "IMAGE" | "VIDEO" | string;
    isLocked?: boolean;
    price?: number;
}

const createPostRequest = async (data: CreatePostData) => {
    const response = await fetch(`${API_BASE}/api/v1/post/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
    }

    return response.json();
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPostRequest,
        onSuccess: () => {
            toast.success("Post created successfully!");
            // Invalidate posts queries to refresh the feed/profile
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};
