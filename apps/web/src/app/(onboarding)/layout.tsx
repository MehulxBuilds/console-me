import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCreatorProfile } from "@/utils/auth-utils";
import type { ReactNode } from "react";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Not signed in → go to sign-in
    if (!session) {
        redirect("/sign-in");
    }

    // Already has creator profile → skip onboarding, go to home
    const profile = await checkCreatorProfile(session.user.id);
    if (profile) {
        redirect("/home");
    }

    return <>{children}</>;
}
