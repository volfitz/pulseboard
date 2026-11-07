import { useConnectionStore } from "../store/connectionStore";

export const useConnectionStatus = () =>
  useConnectionStore((state) => state.status);
export const useLastMessageAt = () =>
  useConnectionStore((state) => state.lastMessageAt);
