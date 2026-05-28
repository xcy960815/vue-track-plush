import Vue from 'vue';

import VueTrackPlush from '../plugin';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueTrackPlush, {
  baseURL: window.location.origin,
  url: '/track-api',
  projectName: '项目名称',
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
