import { defineConfig } from 'vitepress';

const repositoryUrl = 'https://github.com/xcy960815/vue-track-plush';

export default defineConfig({
  title: 'vue-track-plush',
  description: 'Vue 2.7 tracking plugin based on custom directives.',
  base: '/vue-track-plush/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#2563eb' }],
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      description: 'Vue 2.7 tracking plugin based on custom directives.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/install' },
          { text: 'API', link: '/guide/api' },
          { text: 'Demo', link: '/guide/demo' },
          { text: 'GitHub', link: repositoryUrl },
        ],
        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Install', link: '/guide/install' },
              { text: 'API', link: '/guide/api' },
              { text: 'Online Demo', link: '/guide/demo' },
            ],
          },
        ],
        socialLinks: [
          { icon: 'github', link: repositoryUrl },
        ],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © xuchongyu',
        },
      },
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      description: '基于 Vue 2.7 自定义指令的埋点统计插件。',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh-CN/guide/install' },
          { text: 'API', link: '/zh-CN/guide/api' },
          { text: '演示', link: '/zh-CN/guide/demo' },
          { text: 'GitHub', link: repositoryUrl },
        ],
        sidebar: [
          {
            text: '开始使用',
            items: [
              { text: '安装', link: '/zh-CN/guide/install' },
              { text: 'API', link: '/zh-CN/guide/api' },
              { text: '在线演示', link: '/zh-CN/guide/demo' },
            ],
          },
        ],
        socialLinks: [
          { icon: 'github', link: repositoryUrl },
        ],
        footer: {
          message: '基于 MIT 协议发布。',
          copyright: 'Copyright © xuchongyu',
        },
      },
    },
  },
});
