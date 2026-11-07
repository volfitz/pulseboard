# ADR 0002: Batch Flush Strategy for High-Frequency Updates

## Context

The mock server sends metrics every 100ms (10 messages/second). If we update the Zustand store for every message, React will re-render the charts 10 times per second, leading to CPU spikes and dropped frames.

## Decision

We implemented an `IngestPipeline` that buffers incoming messages. A timer flushes the buffer to the store every 250ms.

- Metrics are coalesced (last-write-wins for the KPI, array-append for the chart).
- Events are batched together.

## Consequences

- **Pros:** UI remains at 60fps. State updates are deterministic (4 renders per second).
- **Cons:** Adds a 250ms delay to the UI. Accepted, as this is imperceptible for telemetry dashboards.
