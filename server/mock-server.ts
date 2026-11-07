import { WebSocketServer, WebSocket } from "ws";
import type {
  WsMessage,
  MetricName,
  EventLevel,
} from "../src/protocol/messages";

// Configuration
const PORT = 8080;
const METRICS: MetricName[] = ["cpu", "memory", "requests", "latency"];
const EVENT_LEVELS: EventLevel[] = ["info", "warn", "error"];

// Args parsing for chaos mode: `npm run mock-server -- --chaos`
const isChaosMode = process.argv.includes("--chaos");

const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 Mock WebSocket Server running on ws://localhost:${PORT}`);
if (isChaosMode) {
  console.log(`🔥 CHAOS MODE ENABLED: Connections will drop randomly.`);
}

wss.on("connection", (ws: WebSocket) => {
  console.log("🔌 Client connected");

  // 1. Send the initial hello message
  const helloMsg: WsMessage = {
    type: "server.hello",
    timestamp: Date.now(),
    payload: {
      clientId: Math.random().toString(36).substring(7),
      serverTime: Date.now(),
    },
  };
  ws.send(JSON.stringify(helloMsg));

  // 2. Setup metrics interval (e.g., 100ms for high frequency)
  const metricsInterval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) return;

    const metric = METRICS[Math.floor(Math.random() * METRICS.length)]!;
    // Generate a random walk value (simulate realistic fluctuating data)
    let baseValue = 50;
    if (metric === "latency") baseValue = 200;

    const value = baseValue + (Math.random() * 20 - 10);

    const msg: WsMessage = {
      type: "metric.tick",
      timestamp: Date.now(),
      payload: { metric, value: Number(value.toFixed(2)) },
    };
    ws.send(JSON.stringify(msg));
  }, 100); // 10 messages per second

  // 3. Setup events interval (e.g., every 3 seconds)
  const eventsInterval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) return;

    const level =
      EVENT_LEVELS[Math.floor(Math.random() * EVENT_LEVELS.length)]!;
    const msg: WsMessage = {
      type: "event.log",
      timestamp: Date.now(),
      payload: {
        id: crypto.randomUUID(),
        level,
        message: `System event occurred at ${new Date().toISOString()}`,
      },
    };
    ws.send(JSON.stringify(msg));
  }, 3000);

  // 4. Setup heartbeat (keep-alive)
  const heartbeatInterval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) return;
    const msg: WsMessage = {
      type: "heartbeat",
      timestamp: Date.now(),
      payload: { intervalMs: 5000 },
    };
    ws.send(JSON.stringify(msg));
  }, 5000);

  // 5. Chaos Mode: Randomly drop connection
  let chaosTimeout: NodeJS.Timeout;
  if (isChaosMode) {
    const dropConnection = () => {
      if (Math.random() < 0.3) {
        console.log("💥 CHAOS: Dropping connection!");
        ws.close();
        return;
      }
      chaosTimeout = setTimeout(dropConnection, Math.random() * 5000 + 2000);
    };
    chaosTimeout = setTimeout(dropConnection, 5000);
  }

  // Cleanup on close
  ws.on("close", () => {
    console.log("🔌 Client disconnected");
    clearInterval(metricsInterval);
    clearInterval(eventsInterval);
    clearInterval(heartbeatInterval);
    if (chaosTimeout) clearTimeout(chaosTimeout);
  });
});
