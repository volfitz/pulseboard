import { WsMessageSchema, type WsMessage } from "./messages";

export type ParseResult =
  | { success: true; data: WsMessage }
  | {
      success: false;
      error: "INVALID_JSON" | "SCHEMA_MISMATCH";
      details: unknown;
    };

/**
 * Safely parses and validates a raw WebSocket string.
 * Never throws; returns a discriminated union result instead.
 */
export function parseMessage(raw: string): ParseResult {
  let json: unknown;

  // 1. Validate JSON structure
  try {
    json = JSON.parse(raw);
  } catch (err) {
    return { success: false, error: "INVALID_JSON", details: err };
  }

  // 2. Validate against Zod schema
  const result = WsMessageSchema.safeParse(json);

  if (!result.success) {
    return {
      success: false,
      error: "SCHEMA_MISMATCH",
      details: result.error.format(),
    };
  }

  return { success: true, data: result.data };
}
