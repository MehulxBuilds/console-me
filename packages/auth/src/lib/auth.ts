import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "@repo/db";
import { env } from "../config/env";

export const auth = betterAuth({
    database: prismaAdapter(client, {
        provider: "postgresql",
    }),

    trustHost: true,                   // 👈 REQUIRED FOR DEV
    secret: env.BETTER_AUTH_SECRET,

    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
        }
    }
});