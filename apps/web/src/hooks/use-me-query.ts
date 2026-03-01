import { useQuery } from "@tanstack/react-query";

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
  const response = await fetch("/api/me", {
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
