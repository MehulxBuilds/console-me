import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { oAuthProxy } from 'better-auth/plugins';
import { server_env as env } from "@repo/env";
import { client } from '@repo/db';

export const auth = betterAuth({
  plugins: [oAuthProxy()],
  database: prismaAdapter(client, {
    provider: 'postgresql'
  }),
  trustedOrigins: [env.WEB_URL,],
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
