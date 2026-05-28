import SafeStorage from './storage';

/**
 * Options used by the generic tracking queue.
 *
 * @template T Queued item type.
 */
export interface TrackQueueOptions<T> {
  maxBatchSize: number;
  flushInterval: number;
  storageKey: string;
  onFlush: (items: T[]) => Promise<void>;
}

/**
 * Generic persistent queue used for batched exposure reporting.
 *
 * @template T Queued item type.
 */
export default class TrackQueue<T> {
  private items: T[] = [];

  private timer = 0;

  private flushing = false;

  private storage: SafeStorage<T[]>;

  private options: TrackQueueOptions<T>;

  /**
   * @param {TrackQueueOptions<T>} options Queue size, flush interval, storage key, and flush handler.
   */
  constructor(options: TrackQueueOptions<T>) {
    this.options = options;
    this.storage = new SafeStorage<T[]>(options.storageKey);
    this.items = this.storage.read([]);

    if (this.items.length > 0) {
      this.scheduleFlush();
    }
  }

  /**
   * @param {T} item Item to append to the queue.
   */
  add(item: T) {
    this.items.push(item);
    this.persist();

    if (this.items.length >= this.options.maxBatchSize) {
      this.flush();
      return;
    }

    this.scheduleFlush();
  }

  /**
   * Flushes queued items through the configured `onFlush` callback.
   */
  async flush() {
    if (this.flushing || this.items.length === 0) return;

    window.clearTimeout(this.timer);
    this.timer = 0;
    this.flushing = true;

    const batch = this.items.splice(0, this.options.maxBatchSize);
    this.persist();

    try {
      await this.options.onFlush(batch);
    } catch (error) {
      this.items.unshift(...batch);
      this.persist();
    } finally {
      this.flushing = false;
      if (this.items.length > 0) {
        this.scheduleFlush();
      }
    }
  }

  /**
   * Clears scheduled timers and flushes remaining queued items.
   */
  destroy() {
    window.clearTimeout(this.timer);
    this.flush();
  }

  /**
   * Schedules a delayed queue flush if no timer is active.
   */
  private scheduleFlush() {
    if (this.timer) return;

    this.timer = window.setTimeout(() => {
      this.flush();
    }, this.options.flushInterval);
  }

  /**
   * Persists current queue contents to localStorage.
   */
  private persist() {
    this.storage.write(this.items);
  }
}
