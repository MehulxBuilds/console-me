import { create } from "zustand";

type HomeUIState = {
  activeNav: string;
  isProfileOpen: boolean;
  setActiveNav: (nav: string) => void;
  openProfile: () => void;
  closeProfile: () => void;
};

export const useHomeUIStore = create<HomeUIState>((set) => ({
  activeNav: "Home",
  isProfileOpen: false,
  setActiveNav: (nav) => set({ activeNav: nav }),
  openProfile: () => set({ isProfileOpen: true, activeNav: "Profile" }),
  closeProfile: () => set({ isProfileOpen: false, activeNav: "Home" }),
}));
