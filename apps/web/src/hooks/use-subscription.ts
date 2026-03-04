import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export const checkSubscription = async (creatorId: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE}/api/v1/subscription/check/${creatorId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to check subscription status");
    }

    const result = await response.json();
    return result.isSubscribed;
};

export const toggleSubscription = async (creatorId: string): Promise<{ isSubscribed: boolean }> => {
    const response = await fetch(`${API_BASE}/api/v1/subscription/${creatorId}`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to toggle subscription");
    }

    const result = await response.json();
    return result;
};

export const useSubscription = (creatorId: string | undefined) => {
    return useQuery({
        queryKey: ["subscription", creatorId],
        queryFn: () => checkSubscription(creatorId!),
        enabled: !!creatorId,
    });
};

export const useToggleSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleSubscription,
        onSuccess: (data, creatorId) => {
            queryClient.invalidateQueries({ queryKey: ["subscription", creatorId] });
        },
    });
};
