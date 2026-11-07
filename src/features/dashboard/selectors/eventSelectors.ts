import { useEventsStore } from "../store/eventsStore";

export const useEvents = () => useEventsStore((state) => state.events);
