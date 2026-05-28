import Vue from 'vue';

import VueTrackPlush from '../plugin';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueTrackPlush, {
  baseURL: window.location.origin,
  url: '/track-api',
  projectName: '项目名称',
  queue: {
    maxBatchSize: 5,
    flushInterval: 2000,
  },
  exposure: {
    threshold: 0.5,
    once: true,
  },
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
