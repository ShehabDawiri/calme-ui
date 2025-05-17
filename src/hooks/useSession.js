import { create } from "zustand";

export const useSession = create((set) => ({
  selectedSession: null,
  setSelectedSession: (id) => {
    console.log("setSelectedSession called with:", id); // ← add this
    set({ selectedSession: id });
  },
}));