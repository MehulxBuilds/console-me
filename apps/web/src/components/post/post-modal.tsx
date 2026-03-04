"use client";

import {
  Dialog,
  DialogContent,
} from "@repo/ui";
import { useHomeUIStore } from "@/store/home-ui-store";
import CreatePost from "./create-post";
import { XIcon } from "lucide-react";

export default function PostModal() {
  const { isPostModalOpen, setPostModalOpen } = useHomeUIStore();

  return (
    <Dialog open={isPostModalOpen} onOpenChange={setPostModalOpen}>
      <DialogContent className="max-w-2xl border-zinc-800 bg-black p-0 overflow-hidden rounded-3xl" showCloseButton={false}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
          <button 
            onClick={() => setPostModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <XIcon className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <button className="text-sky-500 font-semibold text-sm hover:underline">Drafts</button>
          </div>
        </div>
        
        <div className="p-4">
          <CreatePost isModal />
        </div>
      </DialogContent>
    </Dialog>
  );
}
