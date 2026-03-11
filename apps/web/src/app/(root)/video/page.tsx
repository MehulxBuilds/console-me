"use client";

import OmegleView from "@/components/omegle/omegle-overlay";
import { useOmegleStore } from "@/store/omegle-store";
import { useEffect } from "react";

export default function VideoPage() {
    const { openOmegle, closeOmegle } = useOmegleStore();

    useEffect(() => {
        openOmegle();

        return () => {
            // Cleanup on page unmount if they didn't leave properly
            closeOmegle();
        };
    }, [openOmegle, closeOmegle]);

    return (
        <main className="min-h-screen bg-black w-full overflow-hidden">
            <OmegleView />
        </main>
    );
}
