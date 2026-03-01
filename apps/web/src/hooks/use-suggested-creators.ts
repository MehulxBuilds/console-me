import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export interface CreatorProfileData {
    id: string;
    subscriptionPrice: number | null;
    user: {
        id: string;
        name: string;
        username: string | null;
        image: string | null;
    };
    createdAt: string;
}

const fetchSuggestedCreators = async (): Promise<CreatorProfileData[]> => {
    const response = await fetch(`${API_BASE}/api/v1/creator/fetch-all-profile`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch suggested creators");
    }

    const result = await response.json();
    return result.data || [];
};

export const useSuggestedCreators = () => {
    return useQuery({
        queryKey: ["creators", "suggested"],
        queryFn: fetchSuggestedCreators,
        staleTime: 60_000,
    });
};
