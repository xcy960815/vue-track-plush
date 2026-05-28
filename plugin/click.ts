import type { CustomEntry, DirectiveEntry, TrackPlushConfig } from './type';
import Tracker from './core/tracker';
import { resolveTrackParams } from './utils';

export default class Click {
  private tracker: Tracker;

  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}, tracker?: Tracker) {
    this.tracker = tracker || new Tracker(trackPlushConfig);
  }

  handleClickEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.tracker.click(currentEntry);
      return;
    }

    if (entry.el.__vtpClickHandler) {
      entry.el.removeEventListener('click', entry.el.__vtpClickHandler);
    }

    entry.el.__vtpClickHandler = () => {
      const trackParams = resolveTrackParams(entry.el, entry.vnode);
      this.tracker.click(trackParams);
    };

    entry.el.addEventListener('click', entry.el.__vtpClickHandler);
  }
}
