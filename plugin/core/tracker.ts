import { createExposurePayload, createTrackPayload } from './payload';
import TrackQueue from './queue';
import { ConsoleTransport, type Transport, XhrTransport } from './transport';
import type {
  ExposurePayload,
  NormalizedTrackPlushConfig,
  TrackPayloadData,
  TrackPlushConfig,
} from '../type';
import { normalizeConfig, normalizeTrackParams } from '../utils';

/**
 * Central tracking service that normalizes payloads and delegates delivery to transport.
 */
export default class Tracker {
  private config: NormalizedTrackPlushConfig;

  private transport: Transport;

  private exposureQueue: TrackQueue<ExposurePayload>;

  private cleanups: Array<() => void> = [];

  /**
   * @param {Partial<TrackPlushConfig>} config Plugin-level tracking configuration.
   * @param {Transport} [transport] Optional transport override for tests or custom delivery.
   */
  constructor(config: Partial<TrackPlushConfig> = {}, transport?: Transport) {
    this.config = normalizeConfig(config);
    this.transport =
      transport || this.config.transport || (this.config.debug ? new ConsoleTransport() : new XhrTransport(this.config));
    this.exposureQueue = new TrackQueue<ExposurePayload>({
      maxBatchSize: this.config.exposureQueueMaxSize,
      flushInterval: this.config.exposureQueueFlushInterval,
      storageKey: this.config.exposureQueueStorageKey,
      onFlush: (items) => this.sendExposureBatch(items),
    });

    this.bindPageLifecycleFlush();
  }

  /**
   * @param {Record<string, unknown>} trackParams Normalized click tracking parameters.
   * @returns {Promise<void>} Promise resolved after the payload is handled.
   */
  click(trackParams: Record<string, unknown>) {
    return this.send(createTrackPayload(this.config, '点击事件', trackParams));
  }

  /**
   * @param {Record<string, unknown>} trackParams Normalized browse tracking parameters.
   * @returns {Promise<void>} Promise resolved after the payload is handled.
   */
  browse(trackParams: Record<string, unknown>) {
    return this.send(createTrackPayload(this.config, '浏览事件', trackParams));
  }

  /**
   * @param {Record<string, unknown>} trackParams Normalized exposure tracking parameters added to the queue.
   */
  exposure(trackParams: Record<string, unknown>) {
    this.exposureQueue.add(trackParams || null);
  }

  /**
   * @param {Record<string, unknown>} trackParams Exposure payload sent immediately without queueing.
   * @returns {Promise<void>} Promise resolved after the payload is handled.
   */
  exposureNow(trackParams: Record<string, unknown>) {
    return this.sendExposureBatch([normalizeTrackParams('exposure', trackParams)]);
  }

  /**
   * @returns {Promise<void>} Promise resolved after queued exposure items are flushed.
   */
  flushExposure() {
    return this.exposureQueue.flush();
  }

  /**
   * Flushes exposure queue and removes lifecycle listeners.
   */
  destroy() {
    this.exposureQueue.destroy();
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
  }

  /**
   * @param {ExposurePayload[]} items Exposure items batched into one tracking payload.
   * @returns {Promise<void>} Promise resolved after the batch is handled.
   */
  private sendExposureBatch(items: ExposurePayload[]) {
    return this.send(createExposurePayload(this.config, items));
  }

  /**
   * @param {TrackPayloadData} data Final tracking payload.
   * @returns {Promise<void>} Promise resolved after transport handling.
   */
  private async send(data: TrackPayloadData) {
    try {
      await this.transport.send({
        baseURL: this.config.baseURL,
        url: this.config.url,
        method: this.config.method,
        debug: this.config.debug,
        timeout: this.config.timeout,
        withCredentials: this.config.withCredentials,
        headers: this.config.headers,
        retry: this.config.retry,
        retryDelay: this.config.retryDelay,
        data,
      });
    } catch (error) {
      // Tracking failures should never break the host application.
    }
  }

  /**
   * Binds page lifecycle events that flush queued exposure data before the page is hidden or unloaded.
   */
  private bindPageLifecycleFlush() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const flush = () => {
      this.flushExposure();
    };

    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);

    this.cleanups.push(() => {
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', flush);
    });
  }
}
