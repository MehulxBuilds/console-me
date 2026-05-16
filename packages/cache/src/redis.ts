import { Redis, type RedisOptions } from "ioredis";
import { server_env as env } from "@repo/env";

export interface UserSession {
    userId: string;
    serverId?: string;
    nodeId: string;
    socketId: string;
    connectedAt: number;
    lastSeen: number;
}

export const getRedisConfig = (): RedisOptions => {
    const host = env.REDIS_HOST || "localhost";
    const isUrl = host.startsWith("redis://") || host.startsWith("rediss://");

    if (isUrl) {
        return {
            username: env.REDIS_USERNAME,
            password: env.REDIS_PASSWORD,
            connectTimeout: 10_000,
            maxRetriesPerRequest: 2,
            retryStrategy: (times) => Math.min(times * 250, 2_000),
            lazyConnect: true,
            tls: host.startsWith("rediss://") ? {} : undefined,
        };
    }

    return {
        host,
        port: Number.parseInt(env.REDIS_PORT || "6379", 10),
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        connectTimeout: 10_000,
        maxRetriesPerRequest: 2,
        retryStrategy: (times) => Math.min(times * 250, 2_000),
        lazyConnect: true,
        tls: env.REDIS_TLS ? {} : undefined,
    };
};

export const createRedisClient = () => {
    const host = env.REDIS_HOST || "localhost";
    const config = getRedisConfig();

    if (host.startsWith("redis://") || host.startsWith("rediss://")) {
        return new Redis(host, config);
    }

    return new Redis(config);
};

export class SessionManager {
    private redis: Redis;
    private readonly SESSION_TTL = 1800; // 30 min

    constructor() {
        this.redis = createRedisClient();

        this.redis.on("connect", () => console.log("Redis connected"));
        this.redis.on("error", (err) => console.error("Redis error:", err));
    }

    async setUserSession(userId: string, session: UserSession): Promise<void> {
        const key = `session:${userId}`;
        await this.redis.setex(key, this.SESSION_TTL, JSON.stringify(session));
    }

    async getUserSession(userId: string): Promise<UserSession | null> {
        const data = await this.redis.get(`session:${userId}`);
        return data ? JSON.parse(data) : null;
    }

    async removeUserSession(userId: string): Promise<void> {
        await this.redis.del(`session:${userId}`);
    }

    async disconnect(): Promise<void> {
        await this.redis.quit();
    }
}

let sessionManagerInstance: SessionManager | null = null;

export function getSessionManager(): SessionManager {
    if (!sessionManagerInstance) {
        sessionManagerInstance = new SessionManager();
    }
    return sessionManagerInstance;
}
