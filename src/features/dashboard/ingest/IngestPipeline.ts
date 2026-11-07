import { parseMessage } from "../../../protocol/parseMessage";
import type { MetricName, EventLog } from "../../../protocol/messages";
import { useMetricsStore } from "../store/metricsStore";
import { useEventsStore } from "../store/eventsStore";
import { INGEST_FLUSH_INTERVAL_MS } from "../../../shared/config/constants";

export class IngestPipeline {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isPaused = false;

  // Buffers
  private metricBuffer: Record<MetricName, number[]> = {
    cpu: [],
    memory: [],
    requests: [],
    latency: [],
  };
  private eventBuffer: EventLog["payload"][] = [];

  start(): void {
    if (this.intervalId) return;
    this.isPaused = false;

    this.intervalId = setInterval(() => {
      this.flush();
    }, INGEST_FLUSH_INTERVAL_MS);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  /**
   * Ingests a raw string message from the transport.
   */
  ingest(rawMessage: string): void {
    const result = parseMessage(rawMessage);

    if (!result.success) {
      // Silently drop invalid messages (could increment a counter in a real app)
      return;
    }

    const msg = result.data;

    if (msg.type === "metric.tick") {
      this.metricBuffer[msg.payload.metric].push(msg.payload.value);

      // Hard limit on buffer size to prevent memory leaks if pause is left on forever
      if (this.metricBuffer[msg.payload.metric].length > 100) {
        this.metricBuffer[msg.payload.metric].shift();
      }
    } else if (msg.type === "event.log") {
      this.eventBuffer.push(msg.payload);
      if (this.eventBuffer.length > 50) this.eventBuffer.shift();
    }
  }

  /**
   * Flushes the buffers to the Zustand stores.
   */
  private flush(): void {
    if (this.isPaused) return;

    let hasMetrics = false;
    let hasEvents = false;

    // 1. Process Metrics (Last-write-wins for KPI, append to history)
    const metricsToUpdate: Partial<Record<MetricName, number[]>> = {};
    for (const [key, values] of Object.entries(this.metricBuffer) as [
      MetricName,
      number[],
    ][]) {
      if (values.length > 0) {
        metricsToUpdate[key] = values;
        this.metricBuffer[key] = [];
        hasMetrics = true;
      }
    }

    // 2. Process Events
    const eventsToUpdate = [...this.eventBuffer];
    if (eventsToUpdate.length > 0) {
      this.eventBuffer = [];
      hasEvents = true;
    }

    // 3. Apply to Stores (Single batch update)
    if (hasMetrics) {
      useMetricsStore
        .getState()
        .applyBatch(metricsToUpdate as Record<MetricName, number[]>);
    }
    if (hasEvents) {
      useEventsStore.getState().addEvents(eventsToUpdate);
    }
  }
}
