import { create } from "zustand";
import type { EventLog } from "../../../protocol/messages";
import { EVENT_FEED_LIMIT } from "../../../shared/config/constants";

interface EventsState {
  events: EventLog["payload"][];
  addEvents: (newEvents: EventLog["payload"][]) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  addEvents: (newEvents) =>
    set((state) => {
      // Prepend new events to the top (newest first)
      const combined = [...newEvents, ...state.events];
      // Enforce limit
      return { events: combined.slice(0, EVENT_FEED_LIMIT) };
    }),
}));
