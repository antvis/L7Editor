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
