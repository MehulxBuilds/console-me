import { API_BASE } from "@/utils/constants";
import { clearStoredAuthToken } from "./auth-token";

export const signOut = async () => {
    clearStoredAuthToken();
    await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
};
