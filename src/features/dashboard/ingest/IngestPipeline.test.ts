import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { IngestPipeline } from './IngestPipeline';
import { useMetricsStore } from '../store/metricsStore';
import { useEventsStore } from '../store/eventsStore';

describe('IngestPipeline', () => {
  let pipeline: IngestPipeline;

  beforeEach(() => {
    vi.useFakeTimers();
    pipeline = new IngestPipeline();
    
    // Reset stores
    useMetricsStore.setState({ metrics: {
      cpu: { current: 0, history: [] },
      memory: { current: 0, history: [] },
      requests: { current: 0, history: [] },
      latency: { current: 0, history: [] },
    }});
    useEventsStore.setState({ events: [] });
  });

  afterEach(() => {
    pipeline.stop();
    vi.useRealTimers();
  });

  it('should batch multiple messages and flush them at the interval', () => {
    pipeline.start();

    // Simulate 100 incoming messages
    for (let i = 0; i < 100; i++) {
      pipeline.ingest(JSON.stringify({
        type: 'metric.tick',
        timestamp: Date.now(),
        payload: { metric: 'cpu', value: i },
      }));
    }

    // Before interval, store should be empty
    expect(useMetricsStore.getState().metrics.cpu.history.length).toBe(0);

    // Advance time by 250ms (INGEST_FLUSH_INTERVAL_MS)
    vi.advanceTimersByTime(250);

    // Now the store should have all 100 values in one batch
    const history = useMetricsStore.getState().metrics.cpu.history;
    expect(history.length).toBe(100);
    expect(history[99]).toBe(99); // Last value preserved
    expect(useMetricsStore.getState().metrics.cpu.current).toBe(99); // KPI updated
  });

  it('should NOT flush when paused', () => {
    pipeline.start();
    pipeline.pause();

    pipeline.ingest(JSON.stringify({
      type: 'metric.tick',
      timestamp: Date.now(),
      payload: { metric: 'cpu', value: 42 },
    }));

    vi.advanceTimersByTime(250);
    
    // Store should still be empty
    expect(useMetricsStore.getState().metrics.cpu.history.length).toBe(0);
  });
});