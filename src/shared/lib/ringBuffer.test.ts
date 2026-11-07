import { describe, it, expect } from "vitest";
import { RingBuffer } from "./ringBuffer";

describe("RingBuffer", () => {
  it("should return an empty array when initialized", () => {
    const rb = new RingBuffer<number>(3);
    expect(rb.toArray()).toEqual([]);
    expect(rb.size).toBe(0);
  });

  it("should preserve insertion order while under capacity", () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    expect(rb.toArray()).toEqual([1, 2]);
    expect(rb.size).toBe(2);
  });

  it("should overwrite the oldest item when capacity is reached", () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.push(3);
    rb.push(4); // Overwrites 1

    expect(rb.toArray()).toEqual([2, 3, 4]);
    expect(rb.size).toBe(3); // Size does not exceed capacity
  });

  it("should handle multiple overwrites correctly", () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.push(3);
    rb.push(4);
    rb.push(5);
    rb.push(6);

    expect(rb.toArray()).toEqual([4, 5, 6]);
    expect(rb.size).toBe(3);
  });
});
