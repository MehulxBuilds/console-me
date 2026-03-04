import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export interface SearchUser {
    id: string;
    name: string;
    username: string;
    image: string | null;
}

const fetchUserSearch = async (query: string): Promise<SearchUser[]> => {
    if (!query.trim()) return [];

    const response = await fetch(`${API_BASE}/api/v1/user/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to search users");
    }

    const result = await response.json();
    console.log(result)
    return result.data || [];
};

export const useUserSearch = (query: string) => {
    return useQuery({
        queryKey: ["search", "users", query],
        queryFn: () => fetchUserSearch(query),
        enabled: query.trim().length > 0,
    });
};
