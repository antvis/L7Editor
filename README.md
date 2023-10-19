<h1 align="center">L7Editor</h1>

<div align="center">

🌍 L7Editor 是一个基于 <a href="https://github.com/antvis/L7">L7</a> 的地理数据编辑工具，

[![npm Version](https://img.shields.io/npm/v/@antv/l7-editor.svg)](https://www.npmjs.com/package/@antv/l7-editor) [![npm License](https://img.shields.io/npm/l/@antv/l7-editor.svg)](https://www.npmjs.com/package/@antv/l7-editor) ![Status](https://badgen.net/github/status/antvis/L7Editor) [![Release Status](https://github.com/antvis/L7Editor/workflows/release/badge.svg?branch=master)](https://github.com/antvis/L7Editor/actions?query=workflow:release)


[![Percentage of issues still open](http://isitmaintained.com/badge/open/antvis/L7Editor.svg)](http://isitmaintained.com/project/antvis/L7Editor 'Percentage of issues still open') [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/antvis/L7Editor.svg)](http://isitmaintained.com/project/antvis/L7Editor 'Average time to resolve an issue')

<p align="center">
  <a href="https://l7editor.antv.antgroup.com">主页</a> •
  <a href="https://l7editor.antv.antgroup.com/guide">使用文档</a> •
  <a href="https://l7editor.antv.antgroup.com/docs">组件</a>
</p>

</div>

<img src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*kB5gQYuKgpIAAAAAAAAAAAAADjWqAQ/original" style="width: 100%">

## 📦 安装

```bash
npm install @antv/l7-editor
```

## 🔨 使用

```tsx | pure
// ----js-----
import { L7Editor } from '@antv/l7-editor';

export default () => {
  return <L7Editor autoFitBounds activeTab="geojson" theme="dark" />;
};
```

## ⌨️ 本地开发

```bash
# 安装依赖
npm install

# 工具页面运行页面
npm run start

# 工具页面打包
npm run build
```

## 📖 许可证

MIT@[AntV](https://github.com/antvis).
