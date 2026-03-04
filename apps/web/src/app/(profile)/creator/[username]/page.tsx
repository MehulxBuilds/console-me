"use client";

/* eslint-disable @next/next/no-img-element */
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Bookmark,
  Calendar,
  Ellipsis,
  Heart,
  Home,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Search,
  Share,
  UserRound,
  Users,
} from "lucide-react";
import { useMeQuery } from "@/hooks/use-me-query";
import { useHomeUIStore } from "@/store/home-ui-store";
import { useRouter } from "next/navigation";
import { useCreatorPosts } from "@/hooks/use-creator-posts";
import { useCreatorByUsername } from "@/hooks/use-creator-by-username";
import { useSubscription, useToggleSubscription } from "@/hooks/use-subscription";
import { formatDistanceToNow } from "date-fns";

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

const fallbackBanner =
  "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1400&h=480&fit=crop";
const fallbackAvatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces";

// Empty array to replace, we will use useCreatorPosts now
const profilePosts: any[] = [];

function formatJoinedDate(createdAt?: string) {
  if (!createdAt) return "Joined January 2026";

  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) return "Joined January 2026";

  return `Joined ${parsedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}`;
}

import React from "react";

export default function DynamicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const router = useRouter();
  const { activeNav, setActiveNav, setChatPopoverOpen } = useHomeUIStore();
  
  // Fetch dynamic creator data
  const { data: creatorData, isLoading, isError } = useCreatorByUsername(username);
  const { data: meData } = useMeQuery(true);

  const creatorId = creatorData?.userId;
  const { data: realPosts, isLoading: postsLoading } = useCreatorPosts(creatorId || undefined);
  const { data: isSubscribed, isLoading: subLoading } = useSubscription(creatorId || undefined);
  const { mutate: toggleSub, isPending: subPending } = useToggleSubscription();

  const isOwner = meData?.user?.username === username;

  const profileName = creatorData?.user?.name || username;
  const profileHandle = creatorData?.username ? `@${creatorData.username}` : `@${username}`;
  const profileBio =
    creatorData?.user?.bio ||
    "Welcome to this profile. Add bio and content to personalize this page.";
  const profileAvatar = creatorData?.user?.image || fallbackAvatar;
  const joinedLabel = formatJoinedDate(creatorData?.user?.createdAt || creatorData?.createdAt);

  const onNavClick = (label: string) => {
    setActiveNav(label);
    if (label === "Home") {
      router.push("/home");
      return;
    }
    if (label === "Profile") {
      const myUsername = meData?.user?.username || meData?.user?.email?.split('@')[0] || 'user';
      if (myUsername !== username) {
        router.push(`/creator/${myUsername}`);
      }
      return;
    }
    if (label === "Messages") {
      setChatPopoverOpen(true);
      return;
    }
  };

  const handleSubscribe = () => {
      if (!creatorId) return;
      toggleSub(creatorId);
  };

  const handleMessage = () => {
    if (!creatorId) return;
    router.push(`/chat?u=${creatorId}`);
  };

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)_360px]">
      <aside className="no-scrollbar hidden h-screen overflow-y-auto border-r border-zinc-800 px-5 py-6 lg:sticky lg:top-0 lg:block">
        <div className="mb-8 text-3xl font-semibold tracking-tight">Console Me</div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.label === "Profile" || activeNav === item.label;
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
      </aside>

      <main className="no-scrollbar h-screen overflow-y-auto border-x border-zinc-800">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-zinc-800 bg-black/90 px-4 py-3 backdrop-blur">
          <button onClick={() => router.push("/home")} type="button" className="rounded-full p-2 hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-2xl font-bold">{profileName}</p>
            <p className="text-sm text-zinc-400">{realPosts?.length || 0} posts</p>
          </div>
        </header>

        <section className="relative border-b border-zinc-800">
          <img src={fallbackBanner} alt="Profile banner" className="h-52 w-full object-cover" />
          <div className="absolute -bottom-16 left-4 h-32 w-32 overflow-hidden rounded-full border-4 border-black bg-zinc-900">
            <img src={profileAvatar} alt={profileName} className="h-full w-full object-cover" />
          </div>
        </section>

        <section className="border-b border-zinc-800 px-4 pb-4 pt-20">
          <div className="mb-4 flex items-center justify-end gap-3">
            {isOwner ? (
                <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-white/10" type="button">
                  Edit profile
                </button>
            ) : (
                isSubscribed ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleMessage}
                      className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10" 
                      type="button"
                    >
                      Message
                    </button>
                    <button 
                      onClick={handleSubscribe} 
                      disabled={subPending}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50" 
                      type="button"
                    >
                      Subscribed ✓
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleSubscribe} 
                    disabled={subPending}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50" 
                    type="button"
                  >
                    Subscribe for ${creatorData?.subscriptionPrice?.toString() || "0.00"}
                  </button>
                )
            )}
          </div>

          {isLoading ? <p className="text-sm text-zinc-400">Loading profile...</p> : null}
          {isError ? <p className="text-sm text-red-400">Failed to load profile. They might not exist.</p> : null}

          <div className="mt-2">
            <div className="flex items-center gap-2">
              <h1 className="text-5xl font-extrabold tracking-tight">{profileName}</h1>
              <BadgeCheck className="h-6 w-6 text-sky-400" />
            </div>
            <p className="text-3xl text-zinc-500">{profileHandle}</p>
            <p className="mt-4 max-w-2xl text-zinc-200">{profileBio}</p>

            <div className="mt-4 flex items-center gap-2 text-zinc-400">
              <Calendar className="h-4 w-4" />
              <span>{joinedLabel}</span>
            </div>

            <div className="mt-4 flex gap-5 text-lg">
              <p><span className="font-semibold text-white">0</span> Following</p>
              <p><span className="font-semibold text-white">0</span> Followers</p>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-800">
          <div className="grid grid-cols-3 text-center text-sm font-semibold text-zinc-500">
            <button className="relative py-4 text-white" type="button">
              Posts
              <span className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-sky-500" />
            </button>
            <button className="py-4 hover:bg-white/5" type="button">Replies</button>
            <button className="py-4 hover:bg-white/5" type="button">Media</button>
          </div>
        </section>

        <section>
          {postsLoading && (
            <div className="flex justify-center p-8">
              <p className="text-zinc-400">Loading posts...</p>
            </div>
          )}

          {!postsLoading && (!realPosts || realPosts.length === 0) && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-xl font-bold text-white">No posts yet</p>
              <p className="text-zinc-500">When you post, they will show up here.</p>
            </div>
          )}

          {realPosts?.map((post, index) => (
            <article
              key={post.id}
              className="border-b border-zinc-800 px-4 py-4 transition hover:bg-white/[0.02]"
            >
              <div className="flex gap-3">
                <img src={profileAvatar} alt={profileName} className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="truncate">
                      <span className="text-[17px] font-semibold">{profileName}</span>
                      <span className="ml-2 text-sm text-zinc-400">
                        {profileHandle} - {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
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
                          alt={`Post by ${profileName}`} 
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
      </aside>
    </div>
  );
}
