import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCreatorProfile } from "@/utils/auth-utils";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const profile = await checkCreatorProfile(session.user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  redirect("/home");
}
