import { create } from "zustand";

export const useSession = create((set) => ({
  sessionId: undefined,
  setSelectedSession: (newSession) => set({ sessionId: newSession }),
}));
