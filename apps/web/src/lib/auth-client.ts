import { createAuthClient } from "better-auth/react";
import { web_env as env } from "@/lib/env";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
})