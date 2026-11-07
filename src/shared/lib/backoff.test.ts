import { describe, it, expect } from "vitest";
import { calculateBackoff } from "./backoff";
import {
  RECONNECT_BASE_DELAY_MS,
  RECONNECT_MAX_DELAY_MS,
} from "../config/constants";

describe("calculateBackoff", () => {
  it("should calculate correct base delay for first attempt", () => {
    const delay = calculateBackoff(0);
    const jitterRange = RECONNECT_BASE_DELAY_MS * 0.3;

    // Base 500ms ± 30% jitter
    expect(delay).toBeGreaterThanOrEqual(RECONNECT_BASE_DELAY_MS - jitterRange);
    expect(delay).toBeLessThanOrEqual(RECONNECT_BASE_DELAY_MS + jitterRange);
  });

  it("should increase exponentially", () => {
    const delay0 = calculateBackoff(0); // ~500
    const delay2 = calculateBackoff(2); // ~2000
    expect(delay2).toBeGreaterThan(delay0);
  });

  it("should cap at maximum delay", () => {
    const delay10 = calculateBackoff(10); // Attempt 10 would be 512000ms, but capped at 15000
    // 15000ms ± 30% jitter = 10500ms to 19500ms
    expect(delay10).toBeGreaterThanOrEqual(RECONNECT_MAX_DELAY_MS * 0.7);
    expect(delay10).toBeLessThanOrEqual(RECONNECT_MAX_DELAY_MS * 1.3);
  });
});
