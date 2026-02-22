"use client";

import { Button } from "@repo/ui";
import { signOut } from "@repo/auth/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
          }
        }
      })}>
        Sign Out
      </Button>
    </div>
  );
};