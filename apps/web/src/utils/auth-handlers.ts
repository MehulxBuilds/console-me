import { API_BASE } from "./constants";
import { setStoredAuthToken } from "@/lib/auth-token";

export const loginWithGoogleCredential = async (credential: string) => {
    const response = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Google sign-in failed");
    }

    const result = await response.json();
    if (result?.data?.token) {
        setStoredAuthToken(result.data.token);
    }

    return result;
};
