import SafeStorage from './storage';

export interface TrackQueueOptions<T> {
  maxBatchSize: number;
  flushInterval: number;
  storageKey: string;
  onFlush: (items: T[]) => Promise<void>;
}

export default class TrackQueue<T> {
  private items: T[] = [];

  private timer = 0;

  private flushing = false;

  private storage: SafeStorage<T[]>;

  private options: TrackQueueOptions<T>;

  constructor(options: TrackQueueOptions<T>) {
    this.options = options;
    this.storage = new SafeStorage<T[]>(options.storageKey);
    this.items = this.storage.read([]);

    if (this.items.length > 0) {
      this.scheduleFlush();
    }
  }

  add(item: T) {
    this.items.push(item);
    this.persist();

    if (this.items.length >= this.options.maxBatchSize) {
      this.flush();
      return;
    }

    this.scheduleFlush();
  }

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

  destroy() {
    window.clearTimeout(this.timer);
    this.flush();
  }

  private scheduleFlush() {
    if (this.timer) return;

    this.timer = window.setTimeout(() => {
      this.flush();
    }, this.options.flushInterval);
  }

  private persist() {
    this.storage.write(this.items);
  }
}
