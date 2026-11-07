import {
  RECONNECT_BASE_DELAY_MS,
  RECONNECT_MAX_DELAY_MS,
  RECONNECT_JITTER_FACTOR,
} from "../config/constants";

/**
 * Calculates the delay for the next reconnection attempt.
 * Uses exponential backoff with a cap and random jitter.
 */
export function calculateBackoff(attempt: number): number {
  // 2^attempt * baseDelay (e.g., 500ms, 1000ms, 2000ms, 4000ms...)
  const exponentialDelay = Math.min(
    RECONNECT_MAX_DELAY_MS,
    RECONNECT_BASE_DELAY_MS * Math.pow(2, attempt),
  );

  // Add jitter to prevent thundering herd problem (all clients reconnecting at once)
  const jitterRange = exponentialDelay * RECONNECT_JITTER_FACTOR;
  const jitter = (Math.random() * 2 - 1) * jitterRange;

  return Math.max(0, Math.floor(exponentialDelay + jitter));
}
