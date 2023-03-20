import { defineConfig } from '@umijs/max';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
  title: 'L7 Editor',
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  hash: true,
  theme: {
    "@border-radius-base": "4px",
    "@primary-color": "#1677ff",
  },
  // base: '/geojson-viewer',
  // publicPath: '/geojson-viewer/',
  routes: [
    {
      name: '首页',
      path: '/',
      component: './index',
    },
  ],
  // @ts-ignore
  chainWebpack: (config) => {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: ['json', 'javascript'],
      },
    ]);
  },
  npmClient: 'cnpm',
});
