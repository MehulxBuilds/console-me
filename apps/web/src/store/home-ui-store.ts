import { create } from "zustand";

type HomeUIState = {
  activeNav: string;
  isProfileOpen: boolean;
  isPostModalOpen: boolean;
  isChatPopoverOpen: boolean;
  setActiveNav: (nav: string) => void;
  openProfile: () => void;
  closeProfile: () => void;
  setPostModalOpen: (open: boolean) => void;
  setChatPopoverOpen: (open: boolean) => void;
};

export const useHomeUIStore = create<HomeUIState>((set) => ({
  activeNav: "Home",
  isProfileOpen: false,
  isPostModalOpen: false,
  isChatPopoverOpen: false,
  setActiveNav: (nav) => set({ activeNav: nav }),
  openProfile: () => set({ isProfileOpen: true, activeNav: "Profile" }),
  closeProfile: () => set({ isProfileOpen: false, activeNav: "Home" }),
  setPostModalOpen: (open) => set({ isPostModalOpen: open }),
  setChatPopoverOpen: (open) => set({ isChatPopoverOpen: open }),
}));
