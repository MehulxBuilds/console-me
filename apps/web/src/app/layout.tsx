import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import PostModal from "@/components/post/post-modal";
import FloatingActions from "@/components/chat/floating-actions";
import ChatPopover from "@/components/chat/chat-popover";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Console Me",
  description: "Console Me social experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          {children}
          <PostModal />
          <FloatingActions />
          <ChatPopover />
        </AppProviders>
      </body>
    </html>
  );
}
