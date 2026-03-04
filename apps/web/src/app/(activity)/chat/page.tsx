"use client";

import { useState, useEffect, useRef } from "react";
import { useHomeUIStore } from "@/store/home-ui-store";
import { useConversations, useMessageHistory, useSendMessage } from "@/hooks/use-chat";
import { useSocket } from "@/hooks/use-socket";
import { useMeQuery } from "@/hooks/use-me-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Send, ArrowLeft, MoreHorizontal, Settings, Compass, Bell, Mail, Users, Bookmark, UserRound, Home, MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useUserSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import { useUserById } from "@/hooks/use-user-by-id";

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

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialUserId = searchParams.get("u");

    const { activeNav, setActiveNav, closeProfile, setPostModalOpen, setChatPopoverOpen } = useHomeUIStore();
    const { data: meData } = useMeQuery(true);
    
    // Make sure we close the popover if we are on the full chat page
    useEffect(() => {
        setChatPopoverOpen(false);
    }, [setChatPopoverOpen]);

    const { data: conversations, isLoading: convLoading } = useConversations();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUserId || null);
    const { data: messages, isLoading: messagesLoading } = useMessageHistory(selectedUserId || undefined);
    const { mutate: sendMessage } = useSendMessage();

    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const { data: searchResults, isLoading: searchLoading } = useUserSearch(debouncedSearch);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (initialUserId) {
            setSelectedUserId(initialUserId);
        } else if (conversations && conversations.length > 0 && !selectedUserId) {
            setSelectedUserId(conversations[0].user.id);
        }
    }, [initialUserId, conversations, selectedUserId]);

    // Scroll to bottom when messages attach
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onNavClick = (label: string) => {
        setActiveNav(label);
        if (label === "Home") {
            router.push("/home");
            return;
        }
        if (label === "Profile") {
            const username = meData?.user?.username || meData?.user?.email?.split('@')[0] || 'user';
            router.push(`/creator/${username}`);
            return;
        }
        closeProfile();
    };

    const handleSend = () => {
        if (!newMessage.trim() || !selectedUserId) return;
        
        sendMessage({ receiverId: selectedUserId, content: newMessage });
        setNewMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const activeConversation = conversations?.find(c => c.user.id === selectedUserId);
    const activeSearchContact = searchResults?.find(u => u.id === selectedUserId);
    
    // Check if we need to manually fetch the profile (e.g., coming directly from creator profile with no chat history)
    const needsFetch = selectedUserId && !activeConversation && !activeSearchContact;
    const { data: fetchedUser } = useUserById(needsFetch ? selectedUserId : null);
    
    // Profile info to display for the active chat header
    const activeProfile = activeConversation?.user || activeSearchContact || fetchedUser;

    let displayConversations = conversations || [];
    
    // If we are starting a brand new conversation from a profile link, inject them at the top
    if (fetchedUser && !activeConversation) {
        displayConversations = [
            {
                user: fetchedUser,
                unreadCount: 0,
                lastMessage: "Start a new message",
                lastMessageAt: new Date().toISOString()
            },
            ...displayConversations
        ];
    }

    const filteredConversations = displayConversations.filter(c => 
        c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isSearching = searchQuery.trim().length > 0;
    
    const newContacts = searchResults?.filter(
        su => !filteredConversations.find(c => c.user.id === su.id)
    ) || [];

    return (
        <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)_400px]">
            {/* Left Nav (Reused from Home) */}
            <aside className="no-scrollbar hidden h-screen overflow-y-auto border-r border-zinc-800 px-5 py-6 lg:sticky lg:top-0 lg:block">
                <div className="mb-8 text-3xl font-semibold tracking-tight">Console Me</div>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = item.label === "Messages";
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

            {/* Middle Pane: Conversations List */}
            <main className="no-scrollbar flex h-screen flex-col border-r border-zinc-800 bg-black">
                <div className="sticky top-0 z-10 border-b border-zinc-800 bg-black/95 p-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">Messages</h1>
                        <div className="flex gap-2">
                            <button className="rounded-full p-2 hover:bg-white/10 transition" type="button">
                                <Settings className="h-5 w-5" />
                            </button>
                            <button className="rounded-full p-2 hover:bg-white/10 transition" type="button">
                                <Mail className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search Direct Messages"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border border-zinc-800 bg-zinc-900/50 py-2.5 pl-11 pr-4 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {convLoading && <div className="p-4 text-zinc-500 text-center">Loading conversations...</div>}
                    {!convLoading && !isSearching && displayConversations.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                            <MessageCirclePlus className="h-16 w-16 text-zinc-600 mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Welcome to your inbox!</h2>
                            <p className="text-zinc-500 mb-6 border-b border-zinc-800 pb-8">Drop a line, share posts and more with private conversations between you and others.</p>
                        </div>
                    )}
                    
                    {!convLoading && isSearching && filteredConversations.length === 0 && newContacts.length === 0 && !searchLoading && (
                        <div className="p-8 text-center">
                            <p className="text-zinc-500">No results found for "{searchQuery}"</p>
                        </div>
                    )}

                    {(searchLoading) && isSearching && (
                        <div className="p-4 text-center text-zinc-500 text-sm">Searching users...</div>
                    )}

                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.user.id}
                            onClick={() => setSelectedUserId(conv.user.id)}
                            className={`flex cursor-pointer items-start gap-4 border-b border-zinc-800 p-4 transition-colors ${selectedUserId === conv.user.id ? 'border-r-4 border-r-sky-500 bg-white/5' : 'hover:bg-white/[0.02]'}`}
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
                                        <span className="truncate text-zinc-500 text-sm hidden lg:inline-block">@{conv.user.username}</span>
                                    </div>
                                    <span className="text-xs text-zinc-500 shrink-0 ml-2">
                                        {new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <p className={`truncate text-sm mt-1 ${conv.unreadCount > 0 ? "text-white font-medium" : "text-zinc-500"}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isSearching && newContacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => {
                                if (contact.username) {
                                    router.push(`/creator/${contact.username}`);
                                } else {
                                    setSelectedUserId(contact.id);
                                    setSearchQuery("");
                                }
                            }}
                            className={`flex cursor-pointer items-center gap-4 border-b border-zinc-800 p-4 transition-colors ${selectedUserId === contact.id ? 'border-r-4 border-r-sky-500 bg-white/5' : 'hover:bg-white/[0.02]'}`}
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
            </main>

            {/* Right Pane: Active Chat */}
            <aside className="no-scrollbar hidden h-screen flex-col overflow-hidden bg-black lg:flex relative">
                {!selectedUserId ? (
                    <div className="flex flex-1 items-center justify-center p-12 text-center border-l border-zinc-800">
                        <div className="max-w-xs">
                            <h2 className="text-3xl font-bold mb-4">Select a message</h2>
                            <p className="text-zinc-500 leading-relaxed">Choose from your existing conversations, start a new one, or just keep swimming.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-black/95 p-4 backdrop-blur">
                            <div className="flex items-center gap-3">
                                {activeProfile && (
                                    <>
                                        <img 
                                            src={activeProfile.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"} 
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt={activeProfile.name}
                                        />
                                        <div>
                                            <h2 className="font-bold leading-tight">{activeProfile.name}</h2>
                                            <p className="text-xs text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 mt-0.5 inline-block bg-zinc-900">
                                                @{activeProfile.username}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button className="rounded-full p-2 hover:bg-white/10 transition" type="button">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {messagesLoading && <div className="text-center text-zinc-500">Loading messages...</div>}
                            
                            {messages?.map((msg, idx) => {
                                const isMe = msg.senderId === meData?.user?.id;
                                const showTimestamp = idx === 0 || 
                                    (new Date(msg.createdAt).getTime() - new Date(messages[idx-1].createdAt).getTime() > 1000 * 60 * 60);

                                return (
                                    <div key={msg.id}>
                                        {showTimestamp && (
                                            <div className="text-center my-6">
                                                <span className="text-xs text-zinc-500 font-medium">
                                                    {new Date(msg.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                                isMe 
                                                    ? 'bg-sky-500 text-white rounded-br-sm' 
                                                    : 'bg-zinc-800 border border-zinc-700 text-white rounded-bl-sm'
                                            }`}>
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-zinc-800 bg-black p-4 shrink-0 relative">
                            <div className="flex items-end gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-2 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-shadow">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Start a new message"
                                    className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent p-2 text-white placeholder-zinc-500 focus:outline-none no-scrollbar"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!newMessage.trim()}
                                    className="mb-1 rounded-full p-2 text-sky-500 hover:bg-sky-500/10 disabled:opacity-50 transition-colors"
                                    type="button"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}
