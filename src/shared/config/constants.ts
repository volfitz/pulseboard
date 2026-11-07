/**
 * Global configuration constants for the application.
 * Keeping these in one place avoids magic numbers and allows easy tuning.
 */

// WebSocket Server URL. Override with VITE_WS_URL environment variable if needed.
export const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080";

// The interval (in ms) at which buffered WebSocket messages are flushed to the Zustand store.
// 250ms is a deliberate choice: it prevents React from re-rendering on every single message
// (which can happen 50-100 times a second), while still feeling real-time to the user.
export const INGEST_FLUSH_INTERVAL_MS = 250;

// Maximum number of data points to keep in memory for the line chart per metric.
// 120 points with a 250ms flush rate = 30 seconds of data.
export const METRIC_HISTORY_LIMIT = 120;

// Maximum number of events to keep in the live event feed.
export const EVENT_FEED_LIMIT = 200;

// Reconnection (Exponential Backoff) configuration.
export const RECONNECT_BASE_DELAY_MS = 500; // Initial delay before reconnecting
export const RECONNECT_MAX_DELAY_MS = 15000; // Maximum delay cap (15 seconds)
export const RECONNECT_JITTER_FACTOR = 0.3; // ±30% random jitter to prevent thundering herd
