import { create } from "zustand";

export const useModalStore = create((set) => ({
  isRecordModalOpen: false,
  openRecordModal: () => set({ isRecordModalOpen: true }),
  closeRecordModal: () => set({ isRecordModalOpen: false }),
}));
