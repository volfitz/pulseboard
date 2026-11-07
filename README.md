# Pulseboard — Real-Time System Telemetry Dashboard

A high-performance, real-time WebSocket dashboard built with React, TypeScript, and Zustand.

Designed with a focus on **clean architecture**, **type safety**, and **render optimization** for high-frequency data streams.

## Features

- **Real-time data streaming**: Live metrics (CPU, Memory, Requests, Latency) and event logs via WebSocket.
- **Connection resilience**: Automatic reconnection with exponential backoff and jitter.
- **Render optimization**: Batch processing of WebSocket messages (250ms flush) to prevent React from re-rendering on every single tick.
- **Pause/Resume**: Freeze the UI without closing the underlying WebSocket connection.
- **Strict Type Safety**: Zod schemas at the boundary ensure invalid data never reaches the UI.

## Tech Stack

- **React 19 + TypeScript**: UI and strict type checking.
- **Vite**: Fast bundler and dev server.
- **Zustand**: Lightweight, unopinionated state management.
- **Zod**: Runtime validation and type inference.
- **Recharts**: Composable charting library (with animations disabled for performance).
- **Tailwind CSS**: Utility-first styling.

## Architecture Overview

The project follows a strict layered architecture to ensure the separation of concerns. UI components never talk to the WebSocket directly.

[ WebSocket Server ]
│ (Raw String)
▼
[ Transport Layer ] ──(Status)──▶ [ Connection Store ]
│ (Raw String)
▼
[ Protocol Layer ] (Zod Validation)
│ (Typed Object)
▼
[ Ingest Pipeline ] (Buffer & Coalesce)
│ (Batched Updates every 250ms)
▼
[ Zustand Stores ] (Metrics, Events)
│ (Selectors)
▼
[ React Components ]

Key Decisions:
Why the Ingest Pipeline? WebSockets can emit 50-100 messages per second. Calling setState for each message would freeze the browser. The pipeline buffers messages and flushes them to the store in batches (every 250ms), guaranteeing smooth 60fps rendering.

Why Zod? TypeScript types disappear at runtime. WebSocket data is external and untrusted. Zod validates the data boundary and infers the TypeScript types, ensuring a single source of truth.

Quick Start
Install dependencies:

bash
npm install
Start the Mock WebSocket Server:

bash
npm run mock-server
(Optional: Run npm run mock-server -- --chaos to test reconnection logic)

Start the UI (in a new terminal):

bash
npm run dev
Open http://localhost:5173.

Architecture Decision Records (ADRs)
For detailed explanations of technical choices, see the docs/adr/ directory.

ADR 0001: Zod for Schema Derivation

ADR 0002: Batch Flush Strategy

ADR 0003: Transport Abstraction

Known Limitations
Recharts v2 vs v3: Pinned to v2.15.4 for stable React 19 compatibility. Migration to v3 is planned but deferred to avoid breaking changes during the 1-day build window.

Mock Transport: The browser-based mock transport (for static hosting demos) is not yet implemented.

---

### 3. ADR (Mimari Karar Kayıtları)

Claude'un istediği 3 ADR dosyasını `docs/adr/` klasörüne oluşturalım. Bunlar işverene "bu adam sadece kod yazmıyor, neden böyle yaptığını da biliyor" dedirtir.

**`docs/adr/0001-zod-schema-derivation.md`**

# ADR 0001: Use Zod for WebSocket Schema Derivation

## Context

WebSocket data comes from an external source and is untrusted. TypeScript types are compile-time only and do not guarantee runtime safety. We need to validate incoming JSON strings and ensure the UI only receives valid data.

## Decision

We use Zod to define the message schemas. The TypeScript types are inferred using `z.infer`. This guarantees a single source of truth.

## Consequences

- **Pros:** Runtime safety, excellent developer experience, exhaustive type checking with discriminated unions.
- **Cons:** Adds a small bundle size overhead (~10kb gzipped). Accepted as a reasonable trade-off for data integrity.
  docs/adr/0002-batch-flush-strategy.md

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
  docs/adr/0003-transport-abstraction.md

# ADR 0001: Use Zod for WebSocket Schema Derivation

## Context

WebSocket data comes from an external source and is untrusted. TypeScript types are compile-time only and do not guarantee runtime safety. We need to validate incoming JSON strings and ensure the UI only receives valid data.

## Decision

We use Zod to define the message schemas. The TypeScript types are inferred using `z.infer`. This guarantees a single source of truth.

## Consequences

- **Pros:** Runtime safety, excellent developer experience, exhaustive type checking with discriminated unions.
- **Cons:** Adds a small bundle size overhead (~10kb gzipped). Accepted as a reasonable trade-off for data integrity.

```

```
