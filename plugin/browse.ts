import type { CustomEntry, DirectiveEntry, TrackPlushConfig } from './type';
import Tracker from './core/tracker';
import { resolveTrackParams } from './utils';

export default class Browse {
  private tracker: Tracker;

  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}, tracker?: Tracker) {
    this.tracker = tracker || new Tracker(trackPlushConfig);
  }

  handleBrowseEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.tracker.browse(currentEntry);
      return;
    }

    const trackParams = resolveTrackParams(entry.el, entry.vnode);
    this.tracker.browse(trackParams);
  }
}
