# ADR 0001: Use Zod for WebSocket Schema Derivation

## Context

WebSocket data comes from an external source and is untrusted. TypeScript types are compile-time only and do not guarantee runtime safety. We need to validate incoming JSON strings and ensure the UI only receives valid data.

## Decision

We use Zod to define the message schemas. The TypeScript types are inferred using `z.infer`. This guarantees a single source of truth.

## Consequences

- **Pros:** Runtime safety, excellent developer experience, exhaustive type checking with discriminated unions.
- **Cons:** Adds a small bundle size overhead (~10kb gzipped). Accepted as a reasonable trade-off for data integrity.
