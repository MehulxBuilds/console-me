import { redirect } from "next/navigation";
import { checkCreatorProfile, requireAuth } from "@/utils/auth-utils";

export default async function Home() {
  const session = await requireAuth();

  const profile = await checkCreatorProfile(session.user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  redirect("/home");
}
