import type { CustomEntry, DirectiveEntry, TrackPlushConfig } from './type';
import Tracker from './core/tracker';
import { normalizeTrackParams, resolveNormalizedTrackParams } from './utils';

/**
 * Handles browse tracking from directives and custom calls.
 */
export default class Browse {
  private tracker: Tracker;

  /**
   * @param {Partial<TrackPlushConfig>} trackPlushConfig Plugin-level tracking configuration.
   * @param {Tracker} [tracker] Shared tracker instance used by directive handlers.
   */
  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}, tracker?: Tracker) {
    this.tracker = tracker || new Tracker(trackPlushConfig);
  }

  /**
   * @param {DirectiveEntry | CustomEntry} entry Directive entry or custom browse payload.
   */
  handleBrowseEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.tracker.browse(normalizeTrackParams('browse', currentEntry));
      return;
    }

    const trackParams = resolveNormalizedTrackParams('browse', entry.el, entry.binding, entry.vnode);
    this.tracker.browse(trackParams);
  }
}
