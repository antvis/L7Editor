---
title: L7Editor文档
---

### API

<API id='L7Editor'></API>

#### `editConfig` 配置项

配置 L7Editor 初始化默认配置

```js
 editConfig={{ primaryColor: 'red' }}
```

| 属性          | 描述                | 类型                | 默认值    |
| ------------- | ------------------- | ------------------- | --------- |
| baseMap       | 地图选项            | `‘Gaode’｜'Mapbox'` | `Gaode`   |
| mapOption     | 地图配置            | `LarkMapProps`      | `-`       |
| primaryColor  | 图层颜色            | `string`            | `#1677ff` |
| rightWidth    | 右侧边栏宽度        | `number`            | `40`      |
| autoFitBounds | 是否自动调整边界    | `boolean`           | `true`    |
| popupTrigger  | 图层 popup 触发方式 | `'click'｜'hover'`  | `click`   |
| activeTab     | 侧面板展示          | `'code'｜'table'`   | `code`    |

#### `onFeatureChange`

数据变化时的监听方法

```js
    onFeatureChange={(feature: Feature[]) => {}}
```
