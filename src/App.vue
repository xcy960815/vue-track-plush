<template>
  <div class="demo-shell">
    <aside class="demo-nav">
      <div class="brand">
        <h1>vue-track-plush</h1>
        <p>Route based tracking demo</p>
      </div>

      <nav class="nav-list" aria-label="Demo cases">
        <router-link
          v-for="routeItem in navRoutes"
          :key="routeItem.path"
          class="nav-link"
          :to="routeItem.path"
        >
          <span>{{ routeItem.meta.title }}</span>
          <small>{{ routeItem.meta.description }}</small>
        </router-link>
      </nav>
    </aside>
    <main class="demo-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { caseRoutes } from './router';

export default Vue.extend({
  name: 'App',
  computed: {
    navRoutes() {
      return caseRoutes;
    },
  },
});
</script>

<style lang="less">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f5f7fb;
  color: #1f2937;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.demo-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
}

.demo-nav {
  min-height: 100vh;
  padding: 28px 20px;
  border-right: 1px solid #d8dee9;
  background: #ffffff;
}

.brand {
  padding: 0 8px 20px;
  border-bottom: 1px solid #e5e7eb;

  h1 {
    margin: 0 0 8px;
    font-size: 22px;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #667085;
  }
}

.nav-list {
  display: grid;
  gap: 8px;
  margin-top: 20px;
}

.nav-link {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  color: #1f2937;
  text-decoration: none;

  small {
    color: #667085;
    line-height: 1.4;
  }

  &.router-link-active {
    background: #eef2ff;
    color: #3730a3;
  }
}

.demo-content {
  min-width: 0;
  padding: 32px;
}

.case-page {
  display: grid;
  gap: 20px;
}

.case-header {
  h2 {
    margin: 0 0 8px;
    font-size: 28px;
  }

  p {
    margin: 0;
    color: #667085;
  }
}

.case-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px;
  border: 1px solid #d8dee9;
  border-radius: 8px;
  background: #ffffff;
}

button {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  background: #eef2ff;
  color: #3730a3;
  font: inherit;
  cursor: pointer;

  &:hover {
    background: #e0e7ff;
  }
}

@media (max-width: 760px) {
  .demo-shell {
    grid-template-columns: 1fr;
  }

  .demo-nav {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid #d8dee9;
  }
}
</style>

<style lang="less">
.legacy-block {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid #d8dee9;
  border-radius: 8px;
  background: #ffffff;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  p {
    margin: 0;
    color: #667085;
  }
}
</style>
