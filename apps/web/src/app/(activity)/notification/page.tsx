import Link from "next/link";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";

const notificationTypes = [
  { label: "New likes", icon: Heart },
  { label: "Replies", icon: MessageCircle },
  { label: "New followers", icon: UserPlus },
];

export default function NotificationPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-24 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Activity</h1>
            <p className="mt-2 text-zinc-400">Likes, replies, follows, and friend updates will appear here.</p>
          </div>
        </header>

        <section className="space-y-3">
          {notificationTypes.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <item.icon className="h-5 w-5 text-sky-300" />
              </div>
              <div>
                <h2 className="font-semibold">{item.label}</h2>
                <p className="text-sm text-zinc-500">No new activity yet.</p>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 p-8 text-center">
          <h2 className="text-xl font-bold">You are all caught up</h2>
          <p className="mt-2 text-sm text-zinc-500">Check back after people interact with your content.</p>
          <Link
            href="/home"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Back to feed
          </Link>
        </div>
      </div>
    </main>
  );
}
