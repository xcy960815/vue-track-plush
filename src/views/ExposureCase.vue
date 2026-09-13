<template>
  <article v-track:browse="{ pageName: '曝光配置测试页', routeName: 'exposure' }" class="case-page">
    <header class="case-header">
      <h2>曝光配置</h2>
      <p>滚动容器查看不同曝光参数的触发行为。</p>
    </header>

    <section class="scroll-panel">
      <div class="spacer">向下滚动</div>
      <div
        v-track:exposure="{ exposureName: '默认曝光区域', routeName: 'exposure' }"
        class="exposure-box"
      >
        默认曝光：进入视口后上报一次
      </div>
      <div class="spacer small">继续滚动</div>
      <div
        v-track:exposure="{
          exposureName: '停留曝光区域',
          duration: 1000,
          threshold: 0.75,
          routeName: 'exposure',
        }"
        class="exposure-box strong"
      >
        停留曝光：可见 75% 且保持 1 秒
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ExposureCase',
});
</script>

<style scoped lang="less">
.scroll-panel {
  height: 420px;
  overflow-y: auto;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

.spacer {
  height: 360px;
  display: grid;
  place-items: center;
  color: var(--faint);
  font: 600 12px/1 var(--mono);
  letter-spacing: 0.08em;

  &.small {
    height: 220px;
  }
}

.exposure-box {
  min-height: 140px;
  display: grid;
  place-items: center;
  padding: 16px;
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
  text-align: center;

  &.strong {
    border-color: rgba(94, 234, 212, 0.4);
    background: rgba(94, 234, 212, 0.1);
    color: var(--accent-2);
  }
}

html[data-theme='light'] .exposure-box.strong {
  border-color: rgba(13, 148, 136, 0.4);
}
</style>
