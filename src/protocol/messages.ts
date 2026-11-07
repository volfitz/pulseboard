import { z } from "zod";

/**
 * Common envelope for all WebSocket messages.
 * The `type` field acts as the discriminator for the union.
 */
const BaseMessageSchema = z.object({
  type: z.string(),
  timestamp: z.number(),
});

/**
 * Server sends the initial handshake message immediately after connection.
 */
export const ServerHelloSchema = BaseMessageSchema.extend({
  type: z.literal("server.hello"),
  payload: z.object({
    clientId: z.string(),
    serverTime: z.number(),
  }),
});

/**
 * High-frequency metric updates (CPU, Memory, etc.).
 */
export const MetricTickSchema = BaseMessageSchema.extend({
  type: z.literal("metric.tick"),
  payload: z.object({
    metric: z.enum(["cpu", "memory", "requests", "latency"]),
    value: z.number(),
  }),
});

/**
 * Discrete events (alerts, logs) appended to the live feed.
 */
export const EventLogSchema = BaseMessageSchema.extend({
  type: z.literal("event.log"),
  payload: z.object({
    id: z.string(),
    level: z.enum(["info", "warn", "error"]),
    message: z.string(),
  }),
});

/**
 * A simple keep-alive message to prevent proxy timeouts.
 */
export const HeartbeatSchema = BaseMessageSchema.extend({
  type: z.literal("heartbeat"),
  payload: z.object({
    intervalMs: z.number(),
  }),
});

/**
 * The discriminated union of all possible WebSocket messages.
 * This ensures type safety and exhaustive checking in the routing layer.
 */
export const WsMessageSchema = z.discriminatedUnion("type", [
  ServerHelloSchema,
  MetricTickSchema,
  EventLogSchema,
  HeartbeatSchema,
]);

/**
 * Inferred TypeScript types from Zod schemas.
 * DO NOT write these interfaces manually.
 */
export type ServerHello = z.infer<typeof ServerHelloSchema>;
export type MetricTick = z.infer<typeof MetricTickSchema>;
export type EventLog = z.infer<typeof EventLogSchema>;
export type Heartbeat = z.infer<typeof HeartbeatSchema>;
export type WsMessage = z.infer<typeof WsMessageSchema>;

export type MetricName = MetricTick["payload"]["metric"];
export type EventLevel = EventLog["payload"]["level"];
