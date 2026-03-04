"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { GlobalSocketListener } from "@/components/chat/global-socket-listener";

type Props = {
    children: ReactNode;
};

export function AppProviders({ children }: Props) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <GlobalSocketListener />
            <Toaster position="top-center" richColors />
        </QueryClientProvider>
    );
}
