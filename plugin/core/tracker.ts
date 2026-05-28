import { createExposurePayload, createTrackPayload, normalizeTrackParams } from './payload';
import TrackQueue from './queue';
import { type Transport, XhrTransport } from './transport';
import type { ExposurePayload, TrackPlushConfig, TrackParams } from '../type';

const DEFAULT_EXPOSURE_BATCH_SIZE = 20;
const DEFAULT_EXPOSURE_FLUSH_INTERVAL = 2000;
const DEFAULT_EXPOSURE_STORAGE_KEY = 'cacheTrackData';

export default class Tracker {
  private config: Partial<TrackPlushConfig>;

  private transport: Transport;

  private exposureQueue: TrackQueue<ExposurePayload>;

  private cleanups: Array<() => void> = [];

  constructor(config: Partial<TrackPlushConfig> = {}, transport?: Transport) {
    this.config = config;
    this.transport = transport || new XhrTransport(config);
    this.exposureQueue = new TrackQueue<ExposurePayload>({
      maxBatchSize:
        config.queue?.maxBatchSize || Number(config.maxNum) || DEFAULT_EXPOSURE_BATCH_SIZE,
      flushInterval: config.queue?.flushInterval || DEFAULT_EXPOSURE_FLUSH_INTERVAL,
      storageKey: config.queue?.storageKey || DEFAULT_EXPOSURE_STORAGE_KEY,
      onFlush: (items) => this.sendExposureBatch(items),
    });

    this.bindPageLifecycleFlush();
  }

  click(trackParams: TrackParams) {
    return this.send(
      createTrackPayload(this.config, '点击事件', normalizeTrackParams(trackParams, 'buttonName')),
    );
  }

  browse(trackParams: TrackParams) {
    return this.send(
      createTrackPayload(this.config, '浏览事件', normalizeTrackParams(trackParams, 'pageName')),
    );
  }

  exposure(trackParams: TrackParams) {
    this.exposureQueue.add(trackParams || null);
  }

  exposureNow(trackParams: Record<string, unknown>) {
    return this.sendExposureBatch([trackParams]);
  }

  flushExposure() {
    return this.exposureQueue.flush();
  }

  destroy() {
    this.exposureQueue.destroy();
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
  }

  private sendExposureBatch(items: ExposurePayload[]) {
    return this.send(createExposurePayload(this.config, items));
  }

  private async send(data: Record<string, unknown>) {
    try {
      await this.transport.send(data);
    } catch (error) {
      // Tracking failures should never break the host application.
    }
  }

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
