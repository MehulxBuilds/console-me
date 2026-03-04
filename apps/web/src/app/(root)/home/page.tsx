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
import { useMeQuery } from "@/hooks/use-me-query";
import CreatePost from "@/components/post/create-post";
import { useFeedPosts } from "@/hooks/use-feed-posts";
import { useSuggestedCreators } from "@/hooks/use-suggested-creators";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/hooks/use-socket";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { PostData } from "@/hooks/use-creator-posts";

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

// Empty array to replace, we will use useFeedPosts now
const posts: any[] = [];

export default function HomePage() {
  const router = useRouter();
  const { activeNav, setActiveNav, closeProfile, setPostModalOpen } = useHomeUIStore();
  const { data: meData } = useMeQuery(true);
  const { data: feedPosts, isLoading: feedLoading } = useFeedPosts();
  const { data: suggestedCreators } = useSuggestedCreators();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const onNavClick = (label: string) => {
    setActiveNav(label);

    if (label === "Profile") {
      const username = meData?.user?.username || meData?.user?.email?.split('@')[0] || 'user';
      router.push(`/creator/${username}`);
      return;
    }

    closeProfile();
  };

  useEffect(() => {
    if (!socket || !meData?.user) return;

    const handler = (data: any) => {
      const newPost: PostData = {
        id: data.id,
        caption: data.caption,
        media_url: data.media_url,
        media_type: data.media_type,
        isLocked: data.isLocked ?? false,
        price: data.price ?? null,
        createdAt: data.createdAt,
        author: {
          id: meData.user.id,
          name: meData.user.name,
          image: meData.user.image ?? null,
          username: meData.user.username ?? "user",
        },
      };

      queryClient.setQueryData<PostData[]>(["feed", "all"], (old) =>
        old ? [newPost, ...old] : [newPost]
      );
    };

    socket.on("posts:new", handler);

    return () => {
      socket.off("posts:new", handler);
    };
  }, [socket, queryClient, meData]);

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
                className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-xl transition ${isActive
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
        <button
          className="mt-8 w-full rounded-full bg-white py-3 text-xl font-semibold text-black hover:bg-zinc-200 transition-colors"
          type="button"
          onClick={() => setPostModalOpen(true)}
        >
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
              src={meData?.user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"}
              alt="User avatar"
              className="h-11 w-11 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <CreatePost />
            </div>
          </div>
        </section>

        <section>
          {feedLoading && (
            <div className="flex justify-center p-8">
              <p className="text-zinc-400">Loading your feed...</p>
            </div>
          )}

          {!feedLoading && (!feedPosts || feedPosts.length === 0) && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-xl font-bold text-white">Your feed is empty</p>
              <p className="text-zinc-500">Follow creators or check back later for new content.</p>
            </div>
          )}

          {feedPosts?.map((post, index) => (
            <article
              key={post.id}
              className="border-b border-zinc-800 px-4 py-4 transition hover:bg-white/[0.02]"
            >
              <div className="flex gap-3">
                <Link href={`/creator/${post.author?.username || ''}`}>
                  <img
                    src={post.author?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"}
                    alt={`${post.author?.name || 'User'} avatar`}
                    className="h-12 w-12 rounded-full object-cover transition-opacity hover:opacity-80 cursor-pointer"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="truncate">
                      <Link href={`/creator/${post.author?.username || ''}`} className="text-[17px] font-semibold hover:underline cursor-pointer">
                        {post.author?.name || 'User'}
                      </Link>
                      <span className="ml-2 text-sm text-zinc-400">
                        @{post.author?.username || 'user'} - {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                      {post.isLocked && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                    </div>
                    <Ellipsis className="h-5 w-5 text-zinc-500" />
                  </div>
                  <p className="mb-3 text-[17px] leading-6 text-zinc-100">{post.caption}</p>

                  {post.media_url && (
                    <div className="overflow-hidden rounded-2xl border border-zinc-800">
                      {post.media_type === "VIDEO" ? (
                        <video
                          src={post.media_url}
                          className="h-[320px] w-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={post.media_url}
                          alt={`Post by ${post.author.name}`}
                          className="h-[320px] w-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-zinc-500">
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-sky-500/10 hover:text-sky-400" type="button">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">0</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-emerald-500/10 hover:text-emerald-400" type="button">
                      <Repeat2 className="h-4 w-4" />
                      <span className="text-xs">0</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-pink-500/10 hover:text-pink-400" type="button">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">0</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-sky-500/10 hover:text-sky-400" type="button">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-xs">0</span>
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

        <div className="flex flex-col gap-4">
          <h2 className="px-1 text-2xl font-bold">Suggested Creators</h2>
          {suggestedCreators?.slice(0, 3).map((creator) => (
            <div key={creator.id} className="rounded-2xl border border-zinc-800 p-4 transition hover:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <img
                  src={creator.user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"}
                  alt={creator.user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{creator.user.name}</p>
                  <p className="truncate text-sm text-zinc-500">@{creator.user.username || 'creator'}</p>
                </div>
                <button className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-black hover:bg-zinc-200" type="button">
                  View
                </button>
              </div>
            </div>
          ))}

          {(!suggestedCreators || suggestedCreators.length === 0) && (
            <div className="rounded-2xl border border-zinc-800 p-5">
              <h2 className="text-xl font-bold">Explore Content</h2>
              <p className="mt-2 text-sm text-zinc-300">New creators are joining every day. Start following to see more!</p>
            </div>
          )}
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

