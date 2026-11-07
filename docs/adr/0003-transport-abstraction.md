# ADR 0003: Transport Abstraction

## Context

The dashboard relies on a WebSocket connection. However, for static deployments (like GitHub Pages) or unit testing, we might not have a real WebSocket server available.

## Decision

We created a `Transport` interface. The `WebSocketTransport` implements this interface. The UI and State layers depend only on the interface, not the concrete implementation.

## Consequences

- **Pros:** Highly testable. We can easily inject a `MockTransport` later for static demos without changing a single line in the React components.
- **Cons:** Slightly more boilerplate (one extra interface file).
