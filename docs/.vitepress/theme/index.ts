import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import DemoFrame from './components/DemoFrame.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoFrame', DemoFrame);
  },
} satisfies Theme;
