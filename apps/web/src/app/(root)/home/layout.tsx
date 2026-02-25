import { requireAuth } from "@/utils/auth-utils";
import type { ReactNode } from "react";

export default async function HomeLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <div className="mx-auto max-w-[1400px]">{children}</div>
    </div>
  );
}
