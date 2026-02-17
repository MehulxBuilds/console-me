import { auth } from '@repo/auth';
import { signIn } from '@repo/auth/client';

export const authHandler = () => signIn.social({
    provider: 'google',
    callbackURL: "/"
});