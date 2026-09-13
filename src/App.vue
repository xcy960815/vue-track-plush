<template>
  <div class="app-shell">
    <div class="backdrop" aria-hidden="true">
      <div class="backdrop-glow backdrop-glow-a"></div>
      <div class="backdrop-glow backdrop-glow-b"></div>
      <div class="backdrop-grid"></div>
    </div>

    <header class="app-header">
      <a class="brand" href="#/basic">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3.2" />
            <path d="M12 4.5V8M12 16v3.5M4.5 12H8M16 12h3.5" />
          </svg>
        </span>
        <span class="brand-name">vue-track-<strong>plush</strong></span>
      </a>

      <nav class="header-actions" aria-label="Demo actions">
        <button class="icon-button" type="button" aria-label="切换明暗主题" @click="toggleTheme">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
            />
          </svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 13.2A8.2 8.2 0 0 1 10.8 4 8.2 8.2 0 1 0 20 13.2Z" />
          </svg>
        </button>
        <a
          class="github-link"
          href="https://github.com/xcy960815/vue-track-plush"
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.82a9.55 9.55 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            />
          </svg>
          <span>GitHub</span>
        </a>
      </nav>
    </header>

    <section class="hero-strip">
      <div class="hero-main">
        <div class="hero-badges">
          <span class="badge badge-live"><i></i>Live Demo</span>
          <span class="badge">v3.0.1</span>
          <span class="badge">指令式埋点</span>
          <span class="badge">MIT</span>
        </div>
        <h1>
          指令即埋点。
          <span class="grad">点击、浏览与曝光，全程可见。</span>
        </h1>
      </div>
      <div class="install-pill">
        <code>npm i vue-track-plush</code>
        <button class="icon-button" type="button" aria-label="复制安装命令" @click="copyInstall">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="8" width="11" height="11" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        </button>
      </div>
    </section>

    <main class="playground">
      <aside class="case-nav">
        <p class="case-nav-title">演示场景</p>
        <router-link
          v-for="routeItem in navRoutes"
          :key="routeItem.path"
          class="case-link"
          :to="routeItem.path"
        >
          <span class="case-link-title">{{ routeItem.meta.title }}</span>
          <small>{{ routeItem.meta.description }}</small>
        </router-link>
        <p class="case-nav-note">触发埋点后，事件会同步打印到右下角的事件日志。</p>
      </aside>
      <section class="layout-page">
        <router-view />
      </section>
    </main>

    <div class="event-log" :class="{ 'is-open': isLogOpen }">
      <button
        v-if="!isLogOpen"
        class="event-log-toggle"
        type="button"
        aria-controls="event-log-list"
        @click="isLogOpen = true"
      >
        <i class="event-dot" aria-hidden="true"></i>
        <span>事件日志</span>
        <span class="event-count">{{ trackEvents.length }}</span>
      </button>
      <template v-else>
        <div class="event-log-head">
          <span class="event-log-title">事件日志</span>
          <span class="event-count">{{ trackEvents.length }}</span>
          <span class="event-log-actions">
            <button class="text-button" type="button" @click="clearEvents">清空</button>
            <button
              class="icon-button"
              type="button"
              aria-label="收起事件日志"
              @click="isLogOpen = false"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </span>
        </div>
        <div id="event-log-list" class="event-log-list">
          <p v-if="trackEvents.length === 0" class="event-log-empty">
            暂无事件 · 触发点击 / 浏览 / 曝光后这里会实时打印上报 JSON。
          </p>
          <div v-for="trackEvent in trackEvents" :key="trackEvent.id" class="event-item">
            <div class="event-item-head">
              <span class="event-chip">{{ trackEvent.actionType }}</span>
              <span class="event-time">{{ trackEvent.time }}</span>
            </div>
            <pre class="event-json">{{ formatPayload(trackEvent.payload) }}</pre>
          </div>
        </div>
      </template>
    </div>

    <div class="toast-stack" aria-live="polite"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { caseRoutes } from './router';
import eventLog, { type DemoTrackEvent } from './event-log';

const INSTALL_COMMAND = 'npm i vue-track-plush';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      isDark: true,
      isLogOpen: false,
    };
  },
  computed: {
    navRoutes() {
      return caseRoutes;
    },
    trackEvents(): DemoTrackEvent[] {
      return eventLog.events;
    },
  },
  created() {
    this.isDark = document.documentElement.dataset.theme !== 'light';
    window.addEventListener('message', this.handleThemeMessage);
  },
  beforeUnmount() {
    window.removeEventListener('message', this.handleThemeMessage);
  },
  methods: {
    applyTheme(dark: boolean) {
      const theme = dark ? 'dark' : 'light';
      document.documentElement.dataset.theme = theme;
      document.documentElement.classList.toggle('dark', dark);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#070a0f' : '#f4f6fa');
      try {
        localStorage.setItem('vtp-demo-theme', theme);
      } catch {
        /* localStorage 不可用时仅对当前会话生效 */
      }
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme(this.isDark);
    },
    handleThemeMessage(event: MessageEvent) {
      const data = event.data as { type?: string; theme?: string } | null;
      if (!data || data.type !== 'vtp-demo-theme') return;
      this.isDark = data.theme !== 'light';
      this.applyTheme(this.isDark);
    },
    showToast(message: string, kind: 'ok' | 'err' = 'ok') {
      const stack = document.querySelector('.toast-stack');
      if (!stack) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${kind}`;
      toast.textContent = message;
      stack.appendChild(toast);

      window.setTimeout(() => {
        toast.classList.add('leaving');
        window.setTimeout(() => toast.remove(), 240);
      }, 2200);
    },
    copyInstall() {
      const done = () => this.showToast('安装命令已复制');
      const fail = () => this.showToast('复制失败', 'err');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(INSTALL_COMMAND).then(done, fail);
        return;
      }
      try {
        const helper = document.createElement('textarea');
        helper.value = INSTALL_COMMAND;
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        document.body.removeChild(helper);
        done();
      } catch {
        fail();
      }
    },
    clearEvents() {
      eventLog.events = [];
    },
    formatPayload(payload: unknown) {
      return JSON.stringify(payload, null, 2);
    },
  },
});
</script>

<style lang="less">
/* -------------------------------------------------------------------------
   vue-track-plush · Playground
   暗色（默认）/ 亮色双主题，与官网文档主题保持同一套设计语言。
------------------------------------------------------------------------- */

:root {
  font-family:
    Inter,
    'PingFang SC',
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    'Microsoft YaHei',
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --mono: 'SFMono-Regular', ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace;
  color-scheme: dark;
  color: #eef2f7;
  background: #070a0f;

  --bg: #070a0f;
  --bg-soft: #0a0e14;
  --surface: #0c1119;
  --surface-2: #101722;
  --surface-3: #141c29;
  --line: #1e2836;
  --line-soft: #17202d;
  --text: #eef2f7;
  --text-strong: #f8fafc;
  --muted: #8b97a6;
  --faint: #5c6875;
  --accent: #9af068;
  --accent-strong: #7ddd45;
  --accent-2: #5eead4;
  --accent-soft: rgba(154, 240, 104, 0.12);
  --accent-border: rgba(154, 240, 104, 0.35);
  --danger: #ff8f88;
  --header-bg: rgba(7, 10, 15, 0.72);
  --toast-bg: #131b27;
  --glow-a: rgba(124, 92, 255, 0.14);
  --glow-b: rgba(94, 234, 212, 0.1);
  --grid-line: rgba(255, 255, 255, 0.02);
  --shadow-lg: 0 30px 70px rgba(0, 0, 0, 0.4);
  --shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.24);
}

html[data-theme='light'] {
  color-scheme: light;
  color: #1b2733;
  background: #f4f6fa;

  --bg: #f4f6fa;
  --bg-soft: #eef1f7;
  --surface: #ffffff;
  --surface-2: #f5f7fb;
  --surface-3: #eceff6;
  --line: #dfe5ee;
  --line-soft: #e8edf4;
  --text: #1b2733;
  --text-strong: #0f1922;
  --muted: #5d6b7b;
  --faint: #93a0ae;
  --accent: #3f9e22;
  --accent-strong: #36881d;
  --accent-2: #0d9488;
  --accent-soft: rgba(63, 158, 34, 0.1);
  --accent-border: rgba(63, 158, 34, 0.38);
  --danger: #d5423c;
  --header-bg: rgba(255, 255, 255, 0.78);
  --toast-bg: #ffffff;
  --glow-a: rgba(124, 92, 255, 0.09);
  --glow-b: rgba(13, 148, 136, 0.08);
  --grid-line: rgba(15, 25, 40, 0.028);
  --shadow-lg: 0 24px 60px rgba(23, 36, 54, 0.1);
  --shadow-sm: 0 6px 18px rgba(23, 36, 54, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  margin: 0;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button {
  font: inherit;
  cursor: pointer;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

::selection {
  background: rgba(94, 234, 212, 0.24);
}

html[data-theme='light'] ::selection {
  background: rgba(13, 148, 136, 0.16);
}

/* ------------------------------------------------------------------------- */
/* 背景                                                                      */
/* ------------------------------------------------------------------------- */

.app-shell {
  position: relative;
  min-height: 100vh;
  background: var(--bg);
}

.backdrop {
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.backdrop-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}

.backdrop-glow-a {
  top: -14rem;
  left: 6vw;
  width: 38rem;
  height: 26rem;
  background: var(--glow-a);
}

.backdrop-glow-b {
  top: -8rem;
  right: 2vw;
  width: 32rem;
  height: 22rem;
  background: var(--glow-b);
}

.backdrop-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
}

/* ------------------------------------------------------------------------- */
/* 顶栏                                                                      */
/* ------------------------------------------------------------------------- */

.app-header {
  position: sticky;
  z-index: 5;
  top: 0;
  display: flex;
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid var(--line-soft);
  align-items: center;
  justify-content: space-between;
  background: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.brand {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: var(--text-strong);
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 30px;
  height: 30px;
  border: 1px solid var(--accent-border);
  border-radius: 8px;
  background: linear-gradient(145deg, var(--accent-soft), transparent);
  place-items: center;
}

.brand-mark svg {
  width: 18px;
  stroke: var(--accent);
  stroke-width: 1.6;
}

.brand-name {
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.04em;
}

.brand-name strong {
  color: var(--accent);
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.icon-button {
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--muted);
  cursor: pointer;
  place-items: center;
  transition:
    color 160ms ease,
    border-color 160ms ease;
}

.icon-button:hover {
  border-color: var(--accent-border);
  color: var(--text-strong);
}

.icon-button svg {
  width: 15px;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

html[data-theme='dark'] .icon-moon,
html[data-theme='light'] .icon-sun {
  display: none;
}

.github-link {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  transition: color 160ms ease;
}

.github-link:hover {
  color: var(--text-strong);
}

.github-link svg {
  width: 16px;
  fill: currentcolor;
}

/* ------------------------------------------------------------------------- */
/* Hero                                                                      */
/* ------------------------------------------------------------------------- */

.hero-strip {
  position: relative;
  z-index: 1;
  display: flex;
  padding: 22px 20px 16px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.hero-badges {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  gap: 6px;
  height: 22px;
  padding: 0 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  align-items: center;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: var(--surface);
}

.badge-live {
  border-color: var(--accent-border);
  color: var(--accent);
  background: var(--accent-soft);
}

.badge-live i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
}

.hero-strip h1 {
  margin: 10px 0 0;
  color: var(--text-strong);
  font-size: clamp(21px, 2.4vw, 28px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.hero-strip h1 .grad {
  background: linear-gradient(92deg, var(--accent) 10%, var(--accent-2) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.install-pill {
  display: flex;
  gap: 8px;
  padding: 7px 7px 7px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  align-items: center;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.install-pill code {
  color: var(--text-strong);
  font: 600 12px/1.2 var(--mono);
}

/* ------------------------------------------------------------------------- */
/* 演示区                                                                    */
/* ------------------------------------------------------------------------- */

.playground {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 224px minmax(0, 1fr);
  margin: 0 20px 84px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.case-nav {
  display: flex;
  padding: 14px 10px 12px;
  border-right: 1px solid var(--line);
  background: var(--surface-2);
  align-items: stretch;
  flex-direction: column;
  gap: 6px;
}

.case-nav-title {
  margin: 0 6px 6px;
  color: var(--faint);
  font: 700 10px/1 var(--mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.case-link {
  display: grid;
  gap: 2px;
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--muted);
  text-decoration: none;
  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease;
}

.case-link small {
  color: var(--faint);
  font-size: 10.5px;
  line-height: 1.4;
}

.case-link:hover {
  border-color: var(--line);
  background: var(--surface-3);
  color: var(--text);
}

.case-link.router-link-active {
  border-color: var(--accent-border);
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}

.case-link.router-link-active small {
  color: var(--accent);
  opacity: 0.72;
}

.case-nav-note {
  margin: auto 6px 0;
  color: var(--faint);
  font-size: 11px;
  line-height: 1.6;
}

.layout-page {
  min-width: 0;
  padding: 20px 22px 24px;
  background: var(--bg-soft);
}

/* ------------------------------------------------------------------------- */
/* Case 页面（类名被 views / 文档站 DemoFrame 复用，保持稳定）               */
/* ------------------------------------------------------------------------- */

.case-page {
  display: grid;
  gap: 18px;
}

.case-header {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);

  h2 {
    margin: 0 0 6px;
    color: var(--text-strong);
    font-size: 20px;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
}

.case-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

.case-panel button {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid var(--accent-border);
  border-radius: 8px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.case-panel button:hover {
  background: var(--accent);
  color: #06130a;
}

.case-panel button:active {
  transform: translateY(1px);
}

/* ------------------------------------------------------------------------- */
/* 事件日志                                                                  */
/* ------------------------------------------------------------------------- */

.event-log {
  position: fixed;
  z-index: 40;
  right: 20px;
  bottom: 20px;
  display: flex;
  width: min(380px, calc(100vw - 40px));
  flex-direction: column;
  align-items: flex-end;
}

.event-log-toggle {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font: 600 12px/1 var(--mono);
  box-shadow: var(--shadow-sm);
}

.event-log-toggle:hover {
  border-color: var(--accent-border);
  color: var(--accent);
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--faint);
}

.event-log:not(.is-open) .event-dot {
  background: var(--faint);
}

.event-log:not(.is-open) .event-count:not(:empty) {
  color: var(--accent);
}

.event-count {
  color: var(--accent);
  font: 700 11px/1 var(--mono);
}

.event-log.is-open {
  align-items: stretch;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface-2);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.event-log-head {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  align-items: center;
  background: var(--surface);
}

.event-log-title {
  color: var(--text-strong);
  font: 700 12px/1 var(--mono);
  letter-spacing: 0.08em;
}

.event-log-actions {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

.text-button {
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.text-button:hover {
  color: var(--danger);
}

.event-log-list {
  max-height: 300px;
  padding: 10px 12px;
  overflow-y: auto;
  display: grid;
  gap: 10px;
}

.event-log-empty {
  margin: 4px 2px;
  color: var(--faint);
  font-size: 12px;
  line-height: 1.6;
}

.event-item {
  display: grid;
  gap: 6px;
}

.event-item-head {
  display: flex;
  gap: 8px;
  align-items: center;
}

.event-chip {
  padding: 3px 8px;
  border: 1px solid var(--accent-border);
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font: 700 11px/1.2 var(--mono);
}

.event-time {
  color: var(--faint);
  font: 500 11px/1.2 var(--mono);
}

.event-json {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--muted);
  font: 500 11px/1.6 var(--mono);
  white-space: pre-wrap;
  word-break: break-all;
}

/* ------------------------------------------------------------------------- */
/* 滚动条 / Toast                                                            */
/* ------------------------------------------------------------------------- */

.event-log-list::-webkit-scrollbar,
.scroll-panel::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.event-log-list::-webkit-scrollbar-thumb,
.scroll-panel::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 8px;
  background: var(--line);
  background-clip: content-box;
}

.event-log-list::-webkit-scrollbar-thumb:hover,
.scroll-panel::-webkit-scrollbar-thumb:hover {
  background: var(--faint);
  background-clip: content-box;
}

.toast-stack {
  position: fixed;
  z-index: 60;
  bottom: 22px;
  left: 50%;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-direction: column;
  transform: translateX(-50%);
  pointer-events: none;
}

.toast {
  padding: 10px 18px;
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  background: var(--toast-bg);
  color: var(--text-strong);
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  animation: toast-in 220ms cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.toast-err {
  border-color: rgba(255, 122, 115, 0.4);
  color: var(--danger);
}

.toast.leaving {
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ------------------------------------------------------------------------- */
/* 响应式                                                                    */
/* ------------------------------------------------------------------------- */

@media (max-width: 960px) {
  .hero-strip {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .playground {
    grid-template-columns: 1fr;
    margin: 0 12px 76px;
  }

  .case-nav {
    padding: 10px 12px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .case-nav-title,
  .case-nav-note {
    display: none;
  }

  .case-link {
    padding: 6px 12px;
  }

  .case-link small {
    display: none;
  }

  .layout-page {
    padding: 16px 14px 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
