import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useMeQuery } from "./use-me-query";
import { web_env as env } from "@/lib/env";

let socketInstance: Socket | null = null;
let identifiedUserId: string | null = null;

export const useSocket = () => {
    const { data: meData } = useMeQuery(true);
    const [socket, setSocket] = useState<Socket | null>(socketInstance);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!meData?.user?.id) return;

        if (!socketInstance) {
            // Socket IO URL from environment or using API_BASE directly
            const socketUrl = env.NEXT_PUBLIC_WS_URL || "http://localhost:8080";

            console.log("Connecting socket to:", socketUrl);

            socketInstance = io(socketUrl, {
                path: "/api/socket/io",
                withCredentials: true,
                autoConnect: true,
            });
        }

        const currentSocket = socketInstance;

        const identify = () => {
            if (identifiedUserId === meData.user.id) return;
            currentSocket.emit("identify", { userId: meData.user.id });
            identifiedUserId = meData.user.id;
        };

        const handleConnect = () => {
            console.log("Socket connected:", currentSocket.id);
            setIsConnected(true);
            identify();
        };

        const handleDisconnect = (reason: string) => {
            console.log("Socket disconnected:", reason);
            setIsConnected(false);
            identifiedUserId = null;
        };

        const handleConnectError = (error: Error) => {
            console.error("Socket connect error:", error.message, error);
            setIsConnected(false);
        };

        setSocket(currentSocket);
        setIsConnected(currentSocket.connected);

        currentSocket.on("connect", handleConnect);
        currentSocket.on("disconnect", handleDisconnect);
        currentSocket.on("connect_error", handleConnectError);

        if (currentSocket.connected) {
            identify();
        }

        return () => {
            currentSocket.off("connect", handleConnect);
            currentSocket.off("disconnect", handleDisconnect);
            currentSocket.off("connect_error", handleConnectError);
        };
    }, [meData?.user?.id]);

    return { socket, isConnected };
};
