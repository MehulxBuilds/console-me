import Link from "next/link";
import { Search, Sparkles, UserRound } from "lucide-react";

const categories = ["Creators", "Live rooms", "Exclusive drops", "Trending posts"];

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-24 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Search className="h-3.5 w-3.5" />
            Explore
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Discover creators</h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Find new posts, creator pages, and live conversations from across Console Me.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <Sparkles className="mb-4 h-5 w-5 text-sky-300" />
              <h2 className="font-semibold">{category}</h2>
              <p className="mt-2 text-sm text-zinc-500">Fresh activity and recommendations.</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 p-8 text-center">
          <UserRound className="mx-auto h-8 w-8 text-zinc-500" />
          <h2 className="mt-4 text-xl font-bold">Personalized discovery is warming up</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-500">
            Follow creators and interact with posts to tune this page.
          </p>
          <Link
            href="/home"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Back to feed
          </Link>
        </section>
      </div>
    </main>
  );
}
