import { auth } from "@repo/auth";
import { client } from "@repo/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(session);
  }

  // Fetch username from CreatorProfile since Better Auth doesn't return custom fields
  const dbUser = await client.user.findUnique({
    where: { id: session.user.id },
    select: {
      creatorProfile: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return NextResponse.json({
    ...session,
    user: {
      ...session.user,
      username: dbUser?.creatorProfile?.username ?? null,
      creatorId: dbUser?.creatorProfile?.id ?? null,
    },
  });
}
