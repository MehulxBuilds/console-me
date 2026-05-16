import { signIn } from '@/lib/auth-client';
import { web_env as env } from "@/lib/env";

export const authHandler = () => signIn.social({
    provider: 'google',
    callbackURL: `${env.NEXT_PUBLIC_WEB_URL}?success=true`,
    errorCallbackURL: `${env.NEXT_PUBLIC_WEB_URL}/sign-in`,
});
