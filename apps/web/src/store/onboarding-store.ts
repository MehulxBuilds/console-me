import { create } from "zustand";

type OnboardingState = {
    step: 1 | 2 | 3;
    username: string;
    setStep: (step: 1 | 2 | 3) => void;
    setUsername: (username: string) => void;
    nextStep: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
    step: 1,
    username: "",
    setStep: (step) => set({ step }),
    setUsername: (username) => set({ username }),
    nextStep: () =>
        set((state) => ({
            step: Math.min(state.step + 1, 3) as 1 | 2 | 3,
        })),
}));
