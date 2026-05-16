import { API_BASE } from "@/utils/constants";
import { clearStoredAuthToken, getStoredAuthToken } from "./auth-token";

export const signOut = async () => {
    const token = getStoredAuthToken();
    await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    clearStoredAuthToken();
};
