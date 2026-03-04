import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export interface BasicUser {
    id: string;
    name: string;
    username: string;
    image: string | null;
}

const fetchUserById = async (userId: string): Promise<BasicUser> => {
    const response = await fetch(`${API_BASE}/api/v1/user/${userId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    const result = await response.json();
    return result.data;
};

export const useUserById = (userId: string | undefined | null) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUserById(userId as string),
        enabled: !!userId,
    });
};
