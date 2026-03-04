"use client";

import { useState, useRef, useEffect } from "react";
import { useHomeUIStore } from "@/store/home-ui-store";
import { useConversations } from "@/hooks/use-chat";
import { MailPlus, Settings, Maximize2, X, Search, ChevronDown, MessageCirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";

export default function ChatPopover() {
    const { isChatPopoverOpen, setChatPopoverOpen } = useHomeUIStore();
    const { data: conversations, isLoading } = useConversations();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"All" | "Requests">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const { data: searchResults, isLoading: searchLoading } = useUserSearch(debouncedSearch);

    const popoverRef = useRef<HTMLDivElement>(null);

    const filteredConversations = conversations?.filter(c => 
        c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const isSearching = searchQuery.trim().length > 0;
    const hasConversations = filteredConversations.length > 0;
    
    // Users that match search but aren't in existing conversations
    const newContacts = searchResults?.filter(
        su => !filteredConversations.find(c => c.user.id === su.id)
    ) || [];

    return (
        <div
            ref={popoverRef}
            className={`fixed bottom-[96px] right-6 z-40 flex w-[400px] flex-col rounded-2xl border border-zinc-800 bg-black/95 backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out ${isChatPopoverOpen
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-10 scale-95 opacity-0 pointer-events-none"
                }`}
            style={{ maxHeight: "calc(100vh - 120px)", height: "600px" }}
        >
            <div className="flex items-center justify-between border-b border-zinc-800 p-4 shrink-0">
                <h2 className="text-xl font-bold text-white">Chat</h2>
                <div className="flex items-center gap-3 text-white">
                    <button className="rounded-full p-2 hover:bg-white/10" type="button">
                        <Settings className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 hover:bg-white/10" type="button">
                        <MailPlus className="h-5 w-5" />
                    </button>
                    <button
                        className="rounded-full p-2 hover:bg-white/10"
                        onClick={() => {
                            setChatPopoverOpen(false);
                            router.push("/chat");
                        }}
                        type="button"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </button>
                    <button
                        className="rounded-full p-2 hover:bg-white/10"
                        onClick={() => setChatPopoverOpen(false)}
                        type="button"
                    >
                        <ChevronDown className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="p-4 pb-2 shrink-0">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-zinc-800 bg-zinc-900/50 py-2.5 pl-11 pr-4 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>

            <div className="flex gap-2 px-4 py-2 shrink-0">
                <button
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${activeTab === "All"
                            ? "bg-white text-black"
                            : "border border-zinc-700 text-white hover:bg-white/10"
                        }`}
                    onClick={() => setActiveTab("All")}
                    type="button"
                >
                    All
                </button>
                <button
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${activeTab === "Requests"
                            ? "bg-white text-black"
                            : "border border-zinc-700 text-white hover:bg-white/10"
                        }`}
                    onClick={() => setActiveTab("Requests")}
                    type="button"
                >
                    Requests
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
                {isLoading && (
                    <div className="p-4 text-center text-zinc-500">Loading conversations...</div>
                )}
                
                {!isLoading && !isSearching && (!conversations || conversations.length === 0) && (
                    <div className="p-8 text-center flex flex-col items-center">
                        <MessageCirclePlus className="h-12 w-12 text-zinc-600 mb-3" />
                        <h3 className="font-bold text-lg mb-1">Welcome to your inbox!</h3>
                        <p className="text-zinc-500 text-sm">Drop a line, share posts and more with private conversations.</p>
                        <button 
                            className="mt-6 rounded-full bg-sky-500 px-6 py-2 font-bold text-white hover:bg-sky-600 transition" 
                            type="button"
                            onClick={() => {
                                setChatPopoverOpen(false);
                                router.push("/chat");
                            }}
                        >
                            Start a message
                        </button>
                    </div>
                )}

                {!isLoading && isSearching && filteredConversations.length === 0 && newContacts.length === 0 && !searchLoading && (
                    <div className="p-8 text-center">
                        <p className="text-zinc-500">No results found for "{searchQuery}"</p>
                    </div>
                )}

                {(searchLoading) && isSearching && (
                     <div className="p-4 text-center text-zinc-500 text-sm">Searching users...</div>
                )}

                {/* Existing Conversations */}
                {filteredConversations.map((conv) => (
                    <div
                        key={conv.user.id}
                        onClick={() => {
                            setChatPopoverOpen(false);
                            router.push(`/chat?u=${conv.user.id}`);
                        }}
                        className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                        <img
                            src={conv.user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"}
                            alt={conv.user.name}
                            className="h-12 w-12 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 min-w-0">
                                    <h3 className="truncate font-semibold text-white">{conv.user.name}</h3>
                                    <span className="truncate text-zinc-500 text-sm hidden sm:inline-block">@{conv.user.username}</span>
                                </div>
                                <span className="text-xs text-zinc-500 shrink-0 ml-2">
                                    {new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <p className={`truncate text-sm mt-0.5 ${conv.unreadCount > 0 ? "text-white font-medium" : "text-zinc-500"}`}>
                                {conv.lastMessage}
                            </p>
                        </div>
                    </div>
                ))}

                {/* New Search Results */}
                {isSearching && newContacts.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => {
                            setChatPopoverOpen(false);
                            // Only link to profile if we have their username
                            if (contact.username) {
                                router.push(`/creator/${contact.username}`);
                            } else {
                                // Fallback: try to chat directly if no creator profile username
                                router.push(`/chat?u=${contact.id}`);
                            }
                        }}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                        <img
                            src={contact.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"}
                            alt={contact.name}
                            className="h-12 w-12 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="truncate font-semibold text-white">{contact.name}</h3>
                            <span className="truncate text-zinc-500 text-sm">@{contact.username}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
