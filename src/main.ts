import Vue from 'vue';

import VueTrackPlush from '../plugin';
import App from './App.vue';
import { createDemoTrackConfig } from './demo-config';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueTrackPlush, createDemoTrackConfig({
  exposureThreshold: 0.5,
  exposureDuration: 300,
  exposureOnce: true,
  exposureQueueMaxSize: 5,
  exposureQueueFlushInterval: 2000,
}));

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
