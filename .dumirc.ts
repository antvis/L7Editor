import { defineConfig } from 'dumi';
import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  apiParser: {},
  resolve: {
    // 配置入口文件路径，API 解析将从这里开始
    entryFile: './src/index.tsx',
  },
  title: 'L7Editor',
  outputPath: 'dist',
  copy: isProduction ? ['docs/CNAME'] : [],
  themeConfig: {
    carrier: 'L7 Editor',
    pc: {
      primaryColor: '#1677ff',
      borderRadiusBase: '4px',
    },
    footer: false,
  },
  metas: [
    {
      name: 'keywords',
      content: 'L7, Map,GIS Data, GeoJSON, GIS, Editor, AntV, L7Editor',
    },
    {
      name: 'description',
      content: 'A React tool for editing GIS data based on L7',
    },
  ],
  alias: {
    '@': require('path').resolve(__dirname, 'src'),
  },
  mfsu: false,
  logo: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  favicons: [
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original',
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
  chainWebpack: (config: any) => {
    config.plugin('monaco-editor').use(MonacoEditorWebpackPlugin, [
      {
        languages: ['json', 'javascript'],
      },
    ]);
  },
});
