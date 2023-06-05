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
    '@border-radius-base': '4px',
    '@primary-color': '#1677ff',
  },
  mfsu: false,
  favicons: [
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original',
  ],
  // base: '/geojson-viewer',
  // publicPath: '/geojson-viewer/',
  routes: [
    {
      name: '首页',
      path: '/',
      component: './index',
    },
  ],
  headScripts: [
    'https://cdn.bootcdn.net/ajax/libs/Turf.js/6.5.0/turf.min.js',
    'https://cdn.bootcdn.net/ajax/libs/PapaParse/5.4.0/papaparse.min.js',
    'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js',
    `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?058f3804ba67cf2c918042746dcaefbb";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();`,
  ],
  // proxy:{
  //   "/api":{
  //     "target":"https://hz.5i5j.com",
  //     "changeOrigin":true,
  //     "pathRewrite":{"/api":''}
  //   }
  // },
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
