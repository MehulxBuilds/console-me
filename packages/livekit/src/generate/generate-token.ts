import { AccessToken } from "livekit-server-sdk";
import { env } from "../config/env";

export interface GenerateToken {
    roomName: string,
    participantName: string,
    participantIdentity: string,
};

export const generateTokenForUser = () => async ({
    roomName,
    participantName,
    participantIdentity,
}: GenerateToken) => {
    const apiKey = env.LIVEKIT_API_KEY;
    const apiSecret = env.LIVEKIT_API_SECRET;

    const at = new AccessToken(apiKey, apiSecret, {
        identity: participantIdentity || participantName,
        name: participantName,
        ttl: "12h",
    });

    at.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
    });

    const token = await at.toJwt();

    return { token };
};