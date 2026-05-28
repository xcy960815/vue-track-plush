import Vue from 'vue';
import VueRouter from 'vue-router';

import BrowseCase from './views/BrowseCase.vue';
import ClickCase from './views/ClickCase.vue';
import ExposureCase from './views/ExposureCase.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/click',
    },
    {
      path: '/click',
      name: 'click',
      component: ClickCase,
      meta: {
        title: '点击埋点',
      },
    },
    {
      path: '/browse',
      name: 'browse',
      component: BrowseCase,
      meta: {
        title: '浏览埋点',
      },
    },
    {
      path: '/exposure',
      name: 'exposure',
      component: ExposureCase,
      meta: {
        title: '曝光埋点',
      },
    },
  ],
});

export default router;
