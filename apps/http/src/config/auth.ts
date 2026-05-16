import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { oAuthProxy } from 'better-auth/plugins';
import { server_env as env } from "@repo/env";
import { client } from '@repo/db';

export const auth = betterAuth({
  plugins: [oAuthProxy()],
  baseURL: env.SERVER_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(client, {
    provider: 'postgresql'
  }),
  trustedOrigins: [env.WEB_URL, env.SERVER_URL],
  advanced: {
    trustedProxyHeaders: true,
    defaultCookieAttributes: {
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
    },
  },
  onAPIError: {
    errorURL: `${env.WEB_URL}/sign-in`,
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${env.SERVER_URL}/api/auth/callback/google`,
    },
  },
});
