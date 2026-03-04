import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";
import { PostData } from "./use-creator-posts";

const fetchFeedPosts = async (): Promise<PostData[]> => {
    const response = await fetch(`${API_BASE}/api/v1/post/fead/all`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch feed posts");
    }

    const result = await response.json();

    return result.data || [];
};

export const useFeedPosts = () => {
    return useQuery({
        queryKey: ["feed", "all"],
        queryFn: fetchFeedPosts,
        staleTime: 30_000,
    });
};