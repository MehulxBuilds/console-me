import { auth } from '@repo/auth';
import { client } from '@repo/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/sign-in");
    }

    return session;
};

export const requireUnAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        redirect("/");
    }

    return session;
};

export const redirectToHomeIfSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        redirect("/home");
    }

    return session;
}

export const currentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return null;
    }

    const user = await client.user.findUnique({
        where: {
            id: session.user.id,
        }
    })

    return user;
}

export const checkCreatorProfile = async (userId: string) => {
    const profile = await client.creatorProfile.findUnique({
        where: { userId },
        select: { username: true },
    });

    return profile;
};

export const requireOnboardingComplete = async () => {
    const session = await requireAuth();

    const profile = await checkCreatorProfile(session.user.id);

    if (!profile) {
        redirect("/onboarding");
    }

    return { session, profile };
};