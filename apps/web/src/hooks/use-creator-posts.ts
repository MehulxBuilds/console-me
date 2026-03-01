import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export interface PostData {
    id: string;
    caption: string;
    media_url: string;
    media_type: "IMAGE" | "VIDEO";
    isLocked: boolean;
    price: number | null;
    createdAt: string;
    author: {
        id: string;
        username: string;
        image: string | null;
        name: string;
    };
}

const fetchCreatorPosts = async (creatorId: string): Promise<PostData[]> => {
    const response = await fetch(`${API_BASE}/api/v1/post/creator/${creatorId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch creator posts");
    }

    const result = await response.json();
    return result.data || [];
};

export const useCreatorPosts = (creatorId: string | undefined) => {
    return useQuery({
        queryKey: ["posts", "creator", creatorId],
        queryFn: () => fetchCreatorPosts(creatorId!),
        enabled: !!creatorId,
    });
};
