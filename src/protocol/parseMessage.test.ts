import { describe, it, expect } from "vitest";
import { parseMessage } from "./parseMessage";

describe("parseMessage", () => {
  it("should parse a valid metric tick message", () => {
    const raw = JSON.stringify({
      type: "metric.tick",
      timestamp: 123456789,
      payload: { metric: "cpu", value: 45.5 },
    });

    const result = parseMessage(raw);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("metric.tick");
      if (result.data.type === "metric.tick") {
        expect(result.data.payload.metric).toBe("cpu");
        expect(result.data.payload.value).toBe(45.5);
      }
    }
  });

  it("should return INVALID_JSON for malformed strings", () => {
    const result = parseMessage("{ bad json");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("INVALID_JSON");
    }
  });

  it("should return SCHEMA_MISMATCH for unknown message types", () => {
    const raw = JSON.stringify({
      type: "unknown.event",
      timestamp: 123,
      payload: {},
    });

    const result = parseMessage(raw);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("SCHEMA_MISMATCH");
    }
  });

  it("should return SCHEMA_MISMATCH for missing required fields", () => {
    const raw = JSON.stringify({
      type: "metric.tick",
      timestamp: 123,
      payload: { metric: "cpu" }, // Missing 'value'
    });

    const result = parseMessage(raw);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("SCHEMA_MISMATCH");
    }
  });
});
