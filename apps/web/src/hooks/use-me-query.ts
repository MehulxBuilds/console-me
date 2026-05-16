import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/utils/constants";

export type MeResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    creatorId?: string | null;
    image?: string | null;
    role?: string;
    bio?: string | null;
    createdAt?: string;
  };
  session: {
    id: string;
    expiresAt: string;
  };
} | null;

const fetchMe = async (): Promise<MeResponse> => {
  const response = await fetch(`${API_BASE}/api/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load profile");
  }

  return response.json();
};

export const useMeQuery = (enabled: boolean) =>
  useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled,
    staleTime: 60_000,
  });
