"use client";

import { Heart, MessageCircleMore, ShieldCheck, Sparkles, Video } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Safety", href: "#safety" },
  { label: "Stories", href: "#stories" },
  { label: "Pricing", href: "#pricing" },
];

const quickStats = [
  { value: "120K+", label: "weekly matches" },
  { value: "4.9/5", label: "average vibe score" },
  { value: "18s", label: "average match time" },
  { value: "24/7", label: "live globally" },
];

const steps = [
  {
    title: "Pick your mode",
    description: "Choose Random Chat, Date Mode, or Interest Rooms in one tap.",
  },
  {
    title: "Instant smart match",
    description: "AI pairing connects you by vibe, timing, and conversation intent.",
  },
  {
    title: "Keep the right people",
    description: "Save profiles, continue chats, and schedule your next video date.",
  },
];

const stories = [
  {
    name: "Aarav, 25",
    text: "Came for random chat, stayed because conversations felt real and safe.",
  },
  {
    name: "Kiara, 23",
    text: "Date Mode filters out noise. I met quality people in the first week.",
  },
  {
    name: "Nikhil, 27",
    text: "The vibe prompts made it easy to talk, even with complete strangers.",
  },
];

const footerGroups = [
  {
    title: "Product",
    links: ["Random Chat", "Date Mode", "Interest Rooms", "Mobile App"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Safety",
    links: ["Community Rules", "Trust Center", "Report Abuse", "Privacy"],
  },
];

export default function Home() {
  return (
    <main className="landing-bg min-h-screen text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-8">
        <header className="fade-up flex items-center justify-between rounded-full border border-black/10 bg-white/70 px-4 py-3 backdrop-blur-md dark:border-white/15 dark:bg-black/30 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="pulse-glow inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
              <MessageCircleMore className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight sm:text-base">consoleme</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-black/70 dark:text-white/70 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-black dark:hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black sm:px-6">
              Start Matching
            </button>
          </div>
        </header>

        <section className="relative mt-10 overflow-hidden rounded-[2.2rem] border border-black/10 bg-white/55 px-5 pb-14 pt-12 backdrop-blur-md dark:border-white/15 dark:bg-zinc-950/55 sm:px-10 md:mt-12 md:px-14">
          <div className="hero-orbit pointer-events-none absolute left-1/2 top-[46%] h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="fade-up inline-flex items-center rounded-full border border-black/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black/70 dark:border-white/20 dark:bg-zinc-900/70 dark:text-white/70">
              Random Video Chat + Dating
            </p>

            <h1 className="font-display fade-up-delay mt-6 text-balance text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Real Conversations.
              <br />
              Instant Connection.
            </h1>

            <p className="fade-up-delay-2 mx-auto mt-6 max-w-2xl text-pretty text-base text-black/70 dark:text-white/70 sm:text-lg">
              Consoleme brings together the speed of Omegle-style matching and the intention of modern dating.
              Meet new people instantly, vibe safely, and keep the ones worth your time.
            </p>

            <div className="fade-up-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90 dark:bg-white dark:text-black" onClick={() => redirect(env.APP_URL + "/sign-in")}>
                Join Free
              </button>
              <button className="rounded-full border border-black/20 bg-white/80 px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 dark:border-white/25 dark:bg-zinc-900/70 dark:text-white">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-12 flex max-w-5xl items-end justify-center">
            <div className="float-soft absolute left-0 top-8 hidden w-52 rounded-3xl border border-black/10 bg-[#dff0ff] p-4 shadow-lg dark:border-white/10 dark:bg-[#12233a] lg:block">
              <div className="h-28 rounded-2xl bg-gradient-to-br from-[#bcd9ff] to-[#edf6ff]" />
              <p className="mt-3 text-sm font-semibold">4.9 vibe rating</p>
              <p className="text-xs text-black/60 dark:text-white/60">Loved by 2.2k early members</p>
            </div>

            <div className="relative w-full max-w-xs rounded-[2.4rem] border-[8px] border-black bg-black p-2 shadow-2xl sm:max-w-sm">
              <div className="absolute left-1/2 top-2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/30" />
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#fff1d9] via-[#ffd5d5] to-[#ffdede]">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                  alt="Consoleme live match profile"
                  className="h-[420px] w-full object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Live now
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-black/65 p-3 text-left text-white backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Matched in 6 sec</p>
                  <p className="mt-1 text-sm font-semibold">Aanya, 24 - Loves music and late-night talks</p>
                </div>
              </div>
            </div>

            <div className="float-soft-delay absolute -right-2 top-6 hidden w-56 rounded-3xl border border-black/10 bg-[#c6f5cb] p-4 shadow-lg dark:border-white/10 dark:bg-[#15381d] lg:block">
              <p className="text-4xl font-semibold leading-none">8</p>
              <p className="text-sm font-semibold">new matches</p>
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">this week</p>
              <div className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-black">
                Reply boost active
              </div>
            </div>

            <div className="float-soft absolute -bottom-6 right-4 hidden w-56 rounded-3xl border border-black/10 bg-[#ffe6ae] p-4 shadow-lg dark:border-white/10 dark:bg-[#3a2d0f] md:block">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-black/80 px-2 py-1 text-[11px] text-white">
                <Video className="h-3.5 w-3.5" />
                Speed date in 02:17
              </div>
              <p className="text-sm font-semibold">Video rooms with shared prompts</p>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/15 dark:bg-zinc-900/70">
              <div className="mb-3 inline-flex rounded-full bg-black/10 p-2 dark:bg-white/10">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold">AI Vibe Match</p>
              <p className="mt-1 text-xs text-black/65 dark:text-white/65">Pairs you using energy, interests, and timing.</p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/15 dark:bg-zinc-900/70">
              <div className="mb-3 inline-flex rounded-full bg-black/10 p-2 dark:bg-white/10">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold">Safe by Design</p>
              <p className="mt-1 text-xs text-black/65 dark:text-white/65">Blur shield, report tools, and trust score system.</p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/15 dark:bg-zinc-900/70">
              <div className="mb-3 inline-flex rounded-full bg-black/10 p-2 dark:bg-white/10">
                <Heart className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold">Date Mode</p>
              <p className="mt-1 text-xs text-black/65 dark:text-white/65">Move from random chats to serious connections fast.</p>
            </div>
          </div>
        </section>

        <section className="fade-up-delay mx-auto mt-8 grid max-w-6xl gap-3 rounded-[2rem] border border-black/10 bg-white/50 p-4 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/50 sm:grid-cols-2 md:grid-cols-4 sm:p-6">
          {quickStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/15 dark:bg-zinc-900/70">
              <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-black/60 dark:text-white/60">{item.label}</p>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="mt-14">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">How it works</p>
            <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">From stranger to connection in minutes</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="fade-up rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/65">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white dark:bg-white dark:text-black">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-14 grid items-center gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-black/10 bg-white/70 p-7 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/70 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">Plans</p>
            <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">Start free. Upgrade when you are ready.</h2>
            <p className="mt-4 max-w-xl text-base text-black/70 dark:text-white/70">
              Free gives instant chats and daily matches. Plus adds priority matching, unlimited reconnects, and date room boosts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black">
                Try Free
              </button>
              <button className="rounded-full border border-black/20 bg-white/80 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 dark:border-white/20 dark:bg-zinc-900/70">
                See Plus Plan
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 p-7 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/70 sm:p-10">
            <div className="float-soft absolute -right-12 -top-12 h-32 w-32 rounded-full bg-green-300/40 blur-2xl dark:bg-green-500/30" />
            <div className="float-soft-delay absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-blue-300/40 blur-2xl dark:bg-blue-500/30" />
            <h3 className="text-xl font-semibold">Consoleme Plus</h3>
            <p className="mt-1 text-sm text-black/65 dark:text-white/65">Designed for serious dating and deeper conversations.</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 dark:border-white/15 dark:bg-zinc-900/70">Unlimited reconnects</li>
              <li className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 dark:border-white/15 dark:bg-zinc-900/70">Priority AI matching</li>
              <li className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 dark:border-white/15 dark:bg-zinc-900/70">Voice and video date rooms</li>
              <li className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 dark:border-white/15 dark:bg-zinc-900/70">Advanced safety controls</li>
            </ul>
            <p className="mt-6 text-3xl font-semibold">$9.99 <span className="text-sm font-medium text-black/65 dark:text-white/65">/ month</span></p>
          </div>
        </section>

        <section id="safety" className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-black/10 bg-white/70 p-7 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/70 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">Safety first</p>
            <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">Built for safe interactions from day one</h2>
            <p className="mt-4 text-black/70 dark:text-white/70">
              Consoleme includes AI moderation, one-tap reporting, and consent-focused profile controls so users can focus on real conversations.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white/80 p-4 dark:border-white/15 dark:bg-zinc-900/70">
                <p className="text-sm font-semibold">Face blur start</p>
                <p className="mt-1 text-xs text-black/65 dark:text-white/65">Video starts blurred until both users opt in.</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/80 p-4 dark:border-white/15 dark:bg-zinc-900/70">
                <p className="text-sm font-semibold">Behavior scoring</p>
                <p className="mt-1 text-xs text-black/65 dark:text-white/65">Bad actors get restricted automatically.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 p-7 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/70 sm:p-10">
            <div className="float-soft absolute right-6 top-5 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs dark:border-white/15 dark:bg-zinc-900/70">Trust score: 98%</div>
            <h3 className="text-xl font-semibold">Live moderation panel</h3>
            <p className="mt-1 text-sm text-black/65 dark:text-white/65">Automated scan + human review flow.</p>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-black/10 bg-white/85 p-3 dark:border-white/15 dark:bg-zinc-900/75">
                <p className="text-xs uppercase tracking-[0.16em] text-black/55 dark:text-white/55">Status</p>
                <p className="mt-1 text-sm font-semibold">1,904 sessions monitored now</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white/85 p-3 dark:border-white/15 dark:bg-zinc-900/75">
                <p className="text-xs uppercase tracking-[0.16em] text-black/55 dark:text-white/55">Action speed</p>
                <p className="mt-1 text-sm font-semibold">Reports reviewed in under 30 seconds</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white/85 p-3 dark:border-white/15 dark:bg-zinc-900/75">
                <p className="text-xs uppercase tracking-[0.16em] text-black/55 dark:text-white/55">Outcome</p>
                <p className="mt-1 text-sm font-semibold">92% users report safer chat quality</p>
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="mt-14">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">Stories</p>
            <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">People who found their vibe on Consoleme</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {stories.map((story) => (
              <article key={story.name} className="fade-up rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/70">
                <div className="mb-4 inline-flex rounded-full bg-black px-2 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-black">
                  Verified user
                </div>
                <p className="text-sm leading-relaxed text-black/75 dark:text-white/75">"{story.text}"</p>
                <p className="mt-4 text-sm font-semibold">{story.name}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 overflow-hidden rounded-[2rem] border border-black/10 bg-black px-6 py-10 text-white dark:border-white/15 dark:bg-white dark:text-black sm:px-10">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70 dark:text-black/70">Ready to meet someone new?</p>
              <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">Your next conversation starts now.</h2>
            </div>
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 dark:bg-black dark:text-white">
              Create Free Account
            </button>
          </div>
        </section>

        <footer className="mt-10 rounded-[2rem] border border-black/10 bg-white/65 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/65 sm:p-8">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                  <MessageCircleMore className="h-4 w-4" />
                </div>
                <span className="text-base font-semibold">consoleme</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-black/70 dark:text-white/70">
                Omegle-style spontaneity meets modern dating intent. Safer, smarter, and built for real conversations.
              </p>
              <p className="mt-5 text-xs text-black/55 dark:text-white/55">support@consoleme.app</p>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55 dark:text-white/55">{group.title}</p>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-black/75 transition hover:text-black dark:text-white/75 dark:hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-black/10 pt-4 text-xs text-black/55 dark:border-white/15 dark:text-white/55">
            (c) {new Date().getFullYear()} Consoleme. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}
