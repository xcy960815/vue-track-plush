<template>
  <div class="demo-shell">
    <aside class="demo-nav">
      <h1>vue-track-plush</h1>
      <router-link to="/click">点击埋点</router-link>
      <router-link to="/browse">浏览埋点</router-link>
      <router-link to="/exposure">曝光埋点</router-link>
    </aside>
    <main class="demo-main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
});
</script>

<style lang="less">
body {
  margin: 0;
}

.demo-shell {
  min-height: 100vh;
  display: flex;
  font-family: Arial, sans-serif;
  color: #1f2933;
}

.demo-nav {
  width: 220px;
  padding: 24px;
  border-right: 1px solid #e4e7eb;
  background: #f7f9fb;

  h1 {
    margin: 0 0 20px;
    font-size: 20px;
  }

  a {
    display: block;
    margin-bottom: 10px;
    padding: 8px 10px;
    color: #334e68;
    text-decoration: none;
    border-radius: 4px;
  }

  a.router-link-active {
    color: #0b7285;
    background: #e6f7f9;
  }
}

.demo-main {
  flex: 1;
  padding: 24px;
}

.case-page {
  max-width: 760px;

  h2 {
    margin: 0 0 20px;
  }
}

.case-block {
  margin-bottom: 18px;
  padding: 16px;
  border: 1px solid #d9e2ec;
  border-radius: 6px;

  h3 {
    margin: 0 0 10px;
    font-size: 16px;
  }
}

button {
  padding: 7px 12px;
  border: 1px solid #9fb3c8;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
</style>
