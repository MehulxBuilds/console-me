"use client";

/* eslint-disable @next/next/no-img-element */
import {
  BarChart3,
  Bell,
  Bookmark,
  CircleDollarSign,
  CirclePlus,
  Ellipsis,
  Heart,
  Home,
  ImageIcon,
  ListFilter,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Search,
  SearchCheck,
  Share,
  SmilePlus,
  UserRound,
  Users,
  Video,
} from "lucide-react";
import { useHomeUIStore } from "@/store/home-ui-store";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Search },
  { label: "Notifications", icon: Bell },
  { label: "Following", icon: Users },
  { label: "Messages", icon: Mail },
  { label: "Bookmarks", icon: Bookmark },
  { label: "Profile", icon: UserRound },
  { label: "More", icon: MoreHorizontal },
];

const trends = [
  "Sydney's subscriber-only drop hits 1M views in 12 hours",
  "Top creators adopt tiered subscriptions and paid bundles",
  "Fan requests surge after exclusive behind-the-scenes release",
];

const posts = [
  {
    name: "Sydney Sweeney",
    handle: "@sydney_sweeney",
    time: "8m",
    content: "Golden hour set photos from today. Which frame is your favorite?",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQEPRel3uekFvf20Kr1hx1zg8Wgj5GlM-SOg&s",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlSqTu-gDPXC3nd5tSodRwghldakiI-K6Yzg&s",
    comments: "3.2K",
    reposts: "6.8K",
    likes: "95K",
    views: "2.1M",
    tier: "VIP",
  },
  {
    name: "Sydney Sweeney",
    handle: "@sydney_sweeney",
    time: "22m",
    content: "BTS from the shoot. Love this look and the whole mood board.",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQEPRel3uekFvf20Kr1hx1zg8Wgj5GlM-SOg&s",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSehPxpdele6hL8UmIP_h3UsD_Uj3_ajT6rBw&s",
    comments: "2.8K",
    reposts: "4.2K",
    likes: "71K",
    views: "1.6M",
    tier: "Gold",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { activeNav, setActiveNav, closeProfile } = useHomeUIStore();

  const onNavClick = (label: string) => {
    setActiveNav(label);

    if (label === "Profile") {
      router.push("/creator");
      return;
    }

    closeProfile();
  };

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)_360px]">
      <aside className="no-scrollbar hidden h-screen overflow-y-auto border-r border-zinc-800 px-5 py-6 lg:sticky lg:top-0 lg:block">
        <div className="mb-8 text-3xl font-semibold tracking-tight">Console Me</div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeNav === item.label;

            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-xl transition ${
                  isActive
                    ? "bg-white/10 font-semibold"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => onNavClick(item.label)}
                type="button"
              >
                <item.icon className="h-6 w-6" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button className="mt-8 w-full rounded-full bg-white py-3 text-xl font-semibold text-black" type="button">
          Post
        </button>
      </aside>

      <main className="no-scrollbar h-screen overflow-y-auto border-x border-zinc-800">
        <div className="sticky top-0 z-10 border-b border-zinc-800 bg-black/90 backdrop-blur">
          <div className="grid grid-cols-3 text-center text-sm font-semibold text-zinc-500">
            <button className="py-4 hover:bg-white/5" type="button">For you</button>
            <button className="relative py-4 text-white hover:bg-white/5" type="button">
              Subscribers
              <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-sky-500" />
            </button>
            <button className="py-4 hover:bg-white/5" type="button">Exclusive</button>
          </div>
        </div>

        <section className="border-b border-zinc-800 p-4">
          <div className="flex gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"
              alt="User avatar"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-3xl text-zinc-500">Share an exclusive drop...</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-3 text-sky-500">
                  <ImageIcon className="h-5 w-5" />
                  <Video className="h-5 w-5" />
                  <SearchCheck className="h-5 w-5" />
                  <ListFilter className="h-5 w-5" />
                  <SmilePlus className="h-5 w-5" />
                  <CirclePlus className="h-5 w-5" />
                  <MapPin className="h-5 w-5" />
                </div>
                <button className="rounded-full bg-white px-6 py-2 font-semibold text-black" type="button">
                  Post
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          {posts.map((post, index) => (
            <article
              key={`${post.handle}-${post.time}-${index}`}
              className="border-b border-zinc-800 px-4 py-4 transition hover:bg-white/[0.02]"
            >
              <div className="flex gap-3">
                <img
                  src={post.avatar}
                  alt={`${post.name} avatar`}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="truncate">
                      <span className="text-[17px] font-semibold">{post.name}</span>
                      <span className="ml-2 text-sm text-zinc-400">{post.handle} - {post.time}</span>
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-xs text-sky-300">
                        <Lock className="h-3 w-3" />
                        {post.tier}
                      </span>
                    </div>
                    <Ellipsis className="h-5 w-5 text-zinc-500" />
                  </div>
                  <p className="mb-3 text-[17px] leading-6 text-zinc-100">{post.content}</p>
                  <div className="overflow-hidden rounded-2xl border border-zinc-800">
                    <img
                      src={post.image}
                      alt={`${post.name} post ${index + 1}`}
                      className="h-[320px] w-full object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-zinc-500">
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-sky-500/10 hover:text-sky-400" type="button">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-emerald-500/10 hover:text-emerald-400" type="button">
                      <Repeat2 className="h-4 w-4" />
                      <span className="text-xs">{post.reposts}</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-pink-500/10 hover:text-pink-400" type="button">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-sky-500/10 hover:text-sky-400" type="button">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-xs">{post.views}</span>
                    </button>
                    <button className="rounded-full p-1 hover:bg-white/10 hover:text-white" type="button">
                      <Share className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <aside className="no-scrollbar hidden h-screen overflow-y-auto px-5 py-4 xl:sticky xl:top-0 xl:block">
        <div className="mb-4 rounded-full border border-zinc-700 px-4 py-3 text-zinc-500">Search</div>

        <div className="mb-4 rounded-2xl border border-zinc-800 p-5">
          <h2 className="text-3xl font-bold">Sydney VIP</h2>
          <p className="mt-3 text-zinc-300">Premium creator feed with subscriber-only drops and bonus bundles.</p>
          <div className="mt-4 flex gap-2">
            <button className="rounded-full bg-sky-500 px-6 py-2 font-semibold" type="button">
              Subscribe $14.99
            </button>
            <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200" type="button">
              Bundle
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-zinc-800 p-5">
          <h3 className="text-xl font-semibold">Support</h3>
          <p className="mt-2 text-sm text-zinc-400">Send a tip to unlock priority replies and custom content requests.</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 font-semibold text-black" type="button">
            <CircleDollarSign className="h-4 w-4" />
            Send Tip
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-800 p-5">
          <h2 className="mb-4 text-4xl font-bold">Trending</h2>
          <div className="space-y-5">
            {trends.map((trend) => (
              <article key={trend}>
                <p className="text-lg font-semibold leading-6">{trend}</p>
                <p className="mt-1 text-sm text-zinc-500">Today - Entertainment</p>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

