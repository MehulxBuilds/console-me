import React, { useState, useRef } from "react";
import { 
  Image as ImageIcon, 
  Video, 
  X, 
  Lock, 
  Unlock, 
  DollarSign, 
  Loader2, 
  Smile, 
  Calendar, 
  MapPin, 
  BarChart3, 
  ChevronDown, 
  Globe2, 
  FileText
} from "lucide-react";
import { useCreatePost } from "@/hooks/use-create-post";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import { useMeQuery } from "@/hooks/use-me-query";
import { useHomeUIStore } from "@/store/home-ui-store";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();
// Note: Replace with actual Giphy API key if available
const gf = new GiphyFetch("sXp3Y96m9oKxdTirLYl93i91Xsc7Kshp");

interface CreatePostProps {
  isModal?: boolean;
}

export default function CreatePost({ isModal }: CreatePostProps) {
  const { setPostModalOpen } = useHomeUIStore();
  const { data: meData } = useMeQuery(true);
  const [caption, setCaption] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"IMAGE" | "VIDEO" | "GIF" | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

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

        resetState();
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const resetState = () => {
    setCaption("");
    setIsLocked(false);
    setPrice(0);
    setFile(null);
    setPreview(null);
    setFileType(null);
    if (isModal) setPostModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setFileType(selectedFile.type.startsWith("video") ? "VIDEO" : "IMAGE");
      setShowGifPicker(false);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setCaption((prev) => prev + emojiData.emoji);
  };

  const onGifClick = (gif: any) => {
    // Use the original or downsized_medium for better quality/compatibility
    const gifUrl = gif.images.downsized_medium.url || gif.images.original.url;
    setPreview(gifUrl);
    setFileType("GIF"); 
    setFile(null); 
    setShowGifPicker(false);
  };

  const handlePost = async () => {
    if (!caption.trim() && !file && !preview) {
      toast.error("Please add a caption or media.");
      return;
    }

    if (file) {
      await startUpload([file]);
    } else {
      await postMutation.mutateAsync({
        caption,
        media_url: preview || undefined,
        media_type: fileType || undefined,
        isLocked,
        price: isLocked ? price : undefined,
      });

      resetState();
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
      {isModal && (
        <img
          src={meData?.user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"}
          alt="User avatar"
          className="h-11 w-11 rounded-full object-cover shrink-0"
        />
      )}
      <div className="flex-1">
        {isModal && (
          <button className="mb-4 flex items-center gap-1 rounded-full border border-sky-500/50 px-3 py-0.5 text-sm font-semibold text-sky-500 hover:bg-sky-500/10 transition">
            Everyone <ChevronDown className="h-4 w-4" />
          </button>
        )}
        
        <textarea
          placeholder="What's happening?"
          className={`w-full bg-transparent text-xl text-white outline-none placeholder:text-zinc-500 resize-none ${isModal ? "min-h-[120px]" : "min-h-[100px]"}`}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isPending}
        />

        {preview && (
          <div className="relative mt-4 group">
            <button
              onClick={removeMedia}
              className="absolute left-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </button>
            {fileType === "IMAGE" || fileType === "GIF" ? (
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

        {isModal && (
          <div className="mt-4 flex items-center gap-2 text-sky-500 text-sm font-semibold border-b border-zinc-800 pb-4">
            <Globe2 className="h-4 w-4" />
            Everyone can reply
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
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
              className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition"
              disabled={isPending}
              title="Media"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <Popover open={showGifPicker} onOpenChange={setShowGifPicker}>
              <PopoverTrigger asChild>
                <button
                  className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition"
                  disabled={isPending}
                  title="GIF"
                >
                  <span className="text-xs font-bold border border-sky-500 rounded-sm px-0.5">GIF</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0 bg-black border-zinc-800" side="bottom" align="start">
                <div className="h-[400px] overflow-y-auto p-2 no-scrollbar">
                  <Grid
                    width={280}
                    columns={2}
                    fetchGifs={(offset) => gf.trending({ offset, limit: 10 })}
                    onGifClick={onGifClick}
                    noLink
                  />
                </div>
              </PopoverContent>
            </Popover>
            <button className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition" disabled={isPending} title="Poll">
              <BarChart3 className="h-5 w-5" />
            </button>
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <button
                  className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition"
                  disabled={isPending}
                  title="Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none bg-transparent" side="bottom" align="start">
                <EmojiPicker 
                  onEmojiClick={onEmojiClick} 
                  theme={Theme.DARK}
                  width={300}
                  height={400}
                />
              </PopoverContent>
            </Popover>
            <button className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition" disabled={isPending} title="Schedule">
              <Calendar className="h-5 w-5" />
            </button>
            <button className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition" disabled={isPending} title="Location">
              <MapPin className="h-5 w-5" />
            </button>

            <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`p-2 transition rounded-full hover:bg-zinc-800 ${isLocked ? "text-amber-500" : "text-sky-500"}`}
              disabled={isPending}
              title={isLocked ? "Locked" : "Public"}
            >
              {isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
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
            disabled={isPending || (!caption.trim() && !file && !preview)}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-2 font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
