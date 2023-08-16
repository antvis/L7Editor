---
title: L7Editor文档
---

### API

### `配置项`

配置 L7Editor 初始化默认配置

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| baseMap | 地图选项 | `‘Gaode’｜'Mapbox'` | `Gaode` |
| mapOption | 地图配置 详见 [MapOptions](https://larkmap.antv.antgroup.com/components/lark-map#mapoptions) | `MapOptions` | `-` |
| primaryColor | 图层颜色 | `string` | `#1677ff` |
| rightPanelWidth | 右侧边栏宽度 | `number` | `40` |
| autoFitBounds | 是否自动调整边界 | `boolean` | `true` |
| popupTrigger | 图层 popup 触发方式 | `'click'｜'hover'` | `click` |
| activeTab | 侧面板展示 | `'geojson'｜'table'｜'wkt'` | `geojson` |
| features | 初始化数据 | ` Feature[]` | `[]` |
| officialLayers | 底图选择 | `string[]` | `[]` |
| theme | 主题配置 | `'normal' ｜ 'dark'` | `'normal'` |
| coordConvert | 数据转换 | `'GCJ02'｜'WGS84'` | `GCJ02` |
| mapControl | 控件显隐 | [MapControlProps](#mapcontrolprops) | `-` |
| toolbar | 头部组件显隐 | [ToolbarProps](#ToolbarProps) | `-` |
| tabItems | 侧面版标签页选项卡内容 | [TabItemType](https://ant-design.antgroup.com/components/tabs-cn#tabitemtype) | `-` |

#### `tabItems`

侧面版标签页选项卡内容，可以自定义拓展组件

#### 组件

搭配`tabItems`一起使用，用来展示右侧面板功能

#### GeoJsonEditor

GeoJSON 文本编辑器，可以通过输入 GeoJSON 数据来实现数据展示

#### WktEditor

WKT 文本编辑器，可以通过输入 WKT 数据来实现数据展示

#### LngLatEditor

LngLat 文本编辑器，可以通过输入 LngLat 数据实现数据展示(目前只支持点数据展示)

#### AppTable

快速展示 GeoJSON 数据中的 properties 数据 ，同时也可以通过表格来展示修改删除 GeoJSON 数据中的 properties 对象中的字段

```js
{
  tabItems: [
    {
      key: 'geojson',
      label: 'GeoJSON',
      children: <GeoJsonEditor />,
    },
    {
      key: 'table',
      label: '表格',
      children: <AppTable />,
    },
  ];
}
```

#### `layerType`¸

底图数据选择

`['googleSatellite'] | ['Satellite','RoadNet','Buildings','Traffic']`

```js
{
  layerType: ['Satellite', 'RoadNet'];
}
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

#### mapControl

控制显示隐藏地图控件

```js
{
  mapControl = {{drawControl: false}}
}
```

#### MapControlProps

| 属性                        | 描述             |
| --------------------------- | ---------------- |
| drawControl                 | 绘制工具         |
| clearControl                | 清除工具         |
| zoomControl                 | 缩放器工具       |
| scaleControl                | 比例尺工具       |
| locationSearchControl       | 地点搜索工具     |
| mouseLocationControl        | 光标经纬度工具   |
| filterControl               | 数据过滤工具     |
| officialLayerControl        | 官方图层控制工具 |
| mapThemeControl             | 图层主题工具     |
| geoLocateControl            | 定位工具         |
| layerColorControl           | 图层颜色控制工具 |
| autoControl                 | 自适应工具       |
| fullscreenControl           | 全屏工具         |
| administrativeSelectControl | 行政区域选择工具 |

#### toolbar

控制显示隐藏头部组件

```js
{
  toolbar = {{logo: false}}
}
```

#### ToolbarProps

| 属性     | 描述 |
| -------- | ---- |
| logo     | logo |
| import   | 上传 |
| download | 下载 |
| guide    | 引导 |
| help     | 帮助 |
| setting  | 设置 |
| theme    | 主题 |

#### `onFeatureChange`

数据变化时的监听方法

```js
    onFeatureChange={(features: Feature[]) => {}}
```
