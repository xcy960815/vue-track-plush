import Vue from 'vue';

export interface DemoTrackEvent {
  id: number;
  time: string;
  actionType: string;
  payload: unknown;
}

interface EventLogStore {
  events: DemoTrackEvent[];
}

const MAX_EVENTS = 60;

const store = Vue.observable<EventLogStore>({ events: [] });

let seq = 0;

/**
 * Appends one tracking payload to the demo event log.
 * @param {unknown} payload Final tracking payload printed by the debug transport.
 * @returns {void}
 */
export const pushTrackEvent = (payload: unknown) => {
  const list = Array.isArray(payload) ? payload : [payload];
  const first = list[0] as Record<string, unknown> | undefined;

  store.events = [
    {
      id: (seq += 1),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      actionType: typeof first?.actionType === 'string' ? first.actionType : '未知事件',
      payload,
    },
    ...store.events,
  ].slice(0, MAX_EVENTS);
};

/**
 * Patches console.info so the plugin's debug transport output feeds the demo
 * event log without changing the plugin itself. Original logging is preserved.
 * @returns {void}
 */
export const installDemoEventCapture = () => {
  const DEBUG_TAG = '[vue-track-plush][debug]';
  const originalInfo = console.info.bind(console);

  console.info = (...args: unknown[]) => {
    const [tag, json] = args;
    if (tag === DEBUG_TAG && typeof json === 'string') {
      try {
        pushTrackEvent(JSON.parse(json));
      } catch {
        /* 非 JSON 输出按原始日志处理 */
      }
    }
    originalInfo(...args);
  };
};

export default store;
