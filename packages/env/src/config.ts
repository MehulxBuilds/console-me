import { z } from "zod";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

export const ServerEnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    PORT: z.string(),
    SOCKET_PORT: z.string(),
    NODE_ENV: z.string().optional(),
    APP_URL: z.string().url(),
    WEB_URL: z.string().url(),
    SERVER_URL: z.string().url(),
    LIVEKIT_API_KEY: z.string(),
    LIVEKIT_API_SECRET: z.string(),
    LIVEKIT_URL: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),
    REDIS_USERNAME: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    GEMINI_API_KEY: z.string(),
    OPENROUTER_API_KEY: z.string(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;
export const server_env = ServerEnvSchema.parse(process.env);