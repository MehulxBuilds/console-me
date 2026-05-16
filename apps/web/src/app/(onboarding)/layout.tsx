import { redirect } from "next/navigation";
import { checkCreatorProfile, requireAuth } from "@/utils/auth-utils";
import type { ReactNode } from "react";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
    const session = await requireAuth();

    const profile = await checkCreatorProfile(session.user.id);
    if (profile) {
        redirect("/home");
    }

    return <>{children}</>;
}
