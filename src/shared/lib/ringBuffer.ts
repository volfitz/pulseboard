/**
 * A fixed-size circular buffer (Ring Buffer).
 * Used to store a limited number of historical data points for charts.
 * Once the buffer is full, adding a new item drops the oldest one.
 */
export class RingBuffer<T> {
  private buffer: (T | undefined)[];
  private head = 0;
  private _size = 0;

  constructor(private readonly capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be greater than 0");
    this.buffer = new Array(capacity).fill(undefined);
  }

  /**
   * Adds a new item to the buffer.
   * If the buffer is full, the oldest item is overwritten.
   */
  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this._size < this.capacity) {
      this._size++;
    }
  }

  /**
   * Returns the items in the buffer in chronological order (oldest to newest).
   */
  toArray(): T[] {
    if (this._size === 0) return [];

    if (this._size < this.capacity) {
      return this.buffer.slice(0, this._size) as T[];
    }

    // If full, the oldest item is at 'head' (which is about to be overwritten)
    const tail = this.buffer.slice(this.head) as T[];
    const head = this.buffer.slice(0, this.head) as T[];
    return [...tail, ...head];
  }

  get size(): number {
    return this._size;
  }

  get limit(): number {
    return this.capacity;
  }
}
