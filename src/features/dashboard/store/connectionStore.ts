import { create } from "zustand";
import type { ConnectionStatus } from "../../../transport/Transport";

interface ConnectionState {
  status: ConnectionStatus;
  lastMessageAt: number | null;
  setStatus: (status: ConnectionStatus) => void;
  markMessageReceived: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: "closed",
  lastMessageAt: null,
  setStatus: (status) => set({ status }),
  markMessageReceived: () => set({ lastMessageAt: Date.now() }),
}));
