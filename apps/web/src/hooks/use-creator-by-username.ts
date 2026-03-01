import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export interface CreatorProfileByUsernameData {
    id: string;
    username: string;
    userId: string;
    subscriptionPrice: number | null;
    user: {
        name: string;
        image: string | null;
        bio: string | null;
        createdAt: string;
    };
    createdAt: string;
}

const fetchCreatorByUsername = async (username: string): Promise<CreatorProfileByUsernameData> => {
    const response = await fetch(`${API_BASE}/api/v1/creator/u/${username}`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Failed to fetch creator profile by username");
    }

    const result = await response.json();
    return result.data;
};

export const useCreatorByUsername = (username: string | undefined) => {
    return useQuery({
        queryKey: ["creatorProfile", "username", username],
        queryFn: () => fetchCreatorByUsername(username!),
        enabled: !!username,
    });
};
