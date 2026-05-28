import Vue from 'vue';

import VueTrackPlush from '../plugin';
import App from './App.vue';
import { createDemoTrackConfig } from './demo-config';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueTrackPlush, createDemoTrackConfig({
  queue: {
    maxBatchSize: 5,
    flushInterval: 2000,
  },
  exposure: {
    threshold: 0.5,
    once: true,
  },
}));

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
