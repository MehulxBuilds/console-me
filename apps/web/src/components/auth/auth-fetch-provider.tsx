"use client";

import { ReactNode, useEffect } from "react";
import { API_BASE } from "@/utils/constants";
import { getStoredAuthToken } from "@/lib/auth-token";

type Props = {
    children: ReactNode;
};

export function AuthFetchProvider({ children }: Props) {
    useEffect(() => {
        const originalFetch = window.fetch.bind(window);

        window.fetch = (input, init = {}) => {
            const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
            const token = getStoredAuthToken();

            if (!token || !url.startsWith(API_BASE)) {
                return originalFetch(input, init);
            }

            const headers = new Headers(init.headers);
            if (!headers.has("Authorization")) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return originalFetch(input, {
                ...init,
                headers,
            });
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    return <>{children}</>;
}
