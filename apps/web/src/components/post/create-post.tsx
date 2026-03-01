"use client";

import React, { useState, useRef } from "react";
import { Image as ImageIcon, Video, X, Lock, Unlock, DollarSign, Loader2 } from "lucide-react";
import { useCreatePost } from "@/hooks/use-create-post";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"IMAGE" | "VIDEO" | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const postMutation = useCreatePost();

  const { startUpload, isUploading } = useUploadThing("PostMediaUpload", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        const mediaUrl = res[0].url;
        const mediaType = res[0].type.startsWith("video") ? "VIDEO" : "IMAGE";

        await postMutation.mutateAsync({
          caption,
          media_url: mediaUrl,
          media_type: mediaType,
          isLocked,
          price: isLocked ? price : undefined,
        });

        // Reset state after success
        setCaption("");
        setIsLocked(false);
        setPrice(0);
        setFile(null);
        setPreview(null);
        setFileType(null);
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setFileType(selectedFile.type.startsWith("video") ? "VIDEO" : "IMAGE");
    }
  };

  const handlePost = async () => {
    if (!caption.trim() && !file) {
      toast.error("Please add a caption or media.");
      return;
    }

    if (file) {
      await startUpload([file]);
    } else {
      await postMutation.mutateAsync({
        caption,
        isLocked,
        price: isLocked ? price : undefined,
      });

      // Reset state for text-only post
      setCaption("");
      setIsLocked(false);
      setPrice(0);
    }
  };

  const removeMedia = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isPending = isUploading || postMutation.isPending;

  if (!mounted) return null;

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <textarea
          placeholder="Share an exclusive drop..."
          className="w-full bg-transparent text-2xl text-white outline-none placeholder:text-zinc-500 resize-none min-h-[100px]"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isPending}
        />

        {preview && (
          <div className="relative mt-4 group">
            <button
              onClick={removeMedia}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </button>
            {fileType === "IMAGE" ? (
              <img
                src={preview}
                alt="Upload preview"
                className="w-full rounded-2xl border border-zinc-800 object-cover max-h-[400px]"
              />
            ) : (
              <video
                src={preview}
                className="w-full rounded-2xl border border-zinc-800 object-cover max-h-[400px]"
                controls
              />
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isPending}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-2 text-sky-500 hover:opacity-80 transition"
              disabled={isPending}
            >
              <ImageIcon className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Image</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-2 text-sky-500 hover:opacity-80 transition"
              disabled={isPending}
            >
              <Video className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Video</span>
            </button>

            <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-2 transition ${isLocked ? "text-amber-500" : "text-zinc-500 hover:text-white"}`}
              disabled={isPending}
              title={isLocked ? "Sensitive content locked" : "Content public"}
            >
              {isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
              <span className="hidden sm:inline text-sm font-medium">{isLocked ? "Locked" : "Public"}</span>
            </button>

            {isLocked && (
              <div className="flex items-center gap-1 rounded-lg bg-zinc-900 px-2 py-1 border border-zinc-800">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                <input
                  type="number"
                  value={price === 0 ? "" : price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-16 bg-transparent text-sm text-white outline-none"
                  min="0"
                  step="0.01"
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          <button
            onClick={handlePost}
            disabled={isPending || (!caption.trim() && !file)}
            className="flex items-center gap-2 rounded-full bg-white px-8 py-2.5 font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
