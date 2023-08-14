---
title: L7Editor文档
---

### API

#### `editConfig` 配置项

配置 L7Editor 初始化默认配置

```js
 editConfig={{ primaryColor: 'red' }}
```

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| baseMap | 地图选项 | `‘Gaode’｜'Mapbox'` | `Gaode` |
| mapOption | 地图配置 详见 [LarkMap](https://larkmap.antv.antgroup.com/components/lark-map#mapoptions) | `LarkMapProps` | `-` |
| primaryColor | 图层颜色 | `string` | `#1677ff` |
| rightPanelWidth | 右侧边栏宽度 | `number` | `40` |
| autoFitBounds | 是否自动调整边界 | `boolean` | `true` |
| popupTrigger | 图层 popup 触发方式 | `'click'｜'hover'` | `click` |
| activeTab | 侧面板展示 | `'geojson'｜'table'｜'wkt'` | `geojson` |
| features | 初始化数据 | `FeatureCollection` | `-` |
| officialLayers | 底图选择 | `string[]` | `[]` |
| theme | 主题配置 | `'normal' ｜ 'dark'` | `'normal'` |
| coordConvert | 数据转换 | `'GCJ02'｜'WGS84'` | `GCJ02` |

#### `layerType`

底图数据选择

`['googleSatellite'] | ['Satellite','RoadNet','Buildings','Traffic']`

```js

editConfig={{ layerType: ['Satellite','RoadNet'] }}

```

| 属性            | 描述       |
| --------------- | ---------- |
| googleSatellite | 谷歌卫星图 |
| Satellite       | 高德卫星图 |
| RoadNet         | 高德路网图 |
| Buildings       | 高德楼块图 |
| Traffic         | 高德路况图 |

#### coordConvert

| 属性  | 描述          |
| ----- | ------------- |
| GCJ02 | WGS84==>GCJ02 |
| WGS84 | GCJ02==>WGS84 |

#### `onFeatureChange`

数据变化时的监听方法

```js
    onFeatureChange={(feature: Feature[]) => {}}
```
