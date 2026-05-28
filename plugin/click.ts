import type { CustomEntry, DirectiveEntry, TrackPlushConfig } from './type';
import Tracker from './core/tracker';
import { normalizeTrackParams, resolveNormalizedTrackParams } from './utils';

/**
 * Handles click tracking bindings and delegates reporting to the shared tracker.
 */
export default class Click {
  private tracker: Tracker;

  /**
   * @param {Partial<TrackPlushConfig>} trackPlushConfig Plugin-level tracking configuration.
   * @param {Tracker} [tracker] Shared tracker instance used by directive handlers.
   */
  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}, tracker?: Tracker) {
    this.tracker = tracker || new Tracker(trackPlushConfig);
  }

  /**
   * @param {DirectiveEntry | CustomEntry} entry Directive entry for DOM binding or custom event payload.
   */
  handleClickEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.tracker.click(normalizeTrackParams('click', currentEntry));
      return;
    }

    if (entry.el.__vtpClickHandler) {
      entry.el.removeEventListener('click', entry.el.__vtpClickHandler);
    }

    entry.el.__vtpClickHandler = () => {
      const trackParams = resolveNormalizedTrackParams('click', entry.el);
      this.tracker.click(trackParams);
    };

    entry.el.addEventListener('click', entry.el.__vtpClickHandler);
  }
}
