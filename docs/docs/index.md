---
title: API
---

### 说明

该文档主要说明将 L7 Editor 作为 React 组件在项目中使用的 API。

**注意在使用 `<L7Editor />` 之前请保证环境中已安装 `"@antv/l7": "^2.0.0"` 和 `"antd": "^5.0.0"`。**

### 代码演示

默认示例

<code src="./index.tsx" compact ></code>

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
| activeTab | 侧面板展示 | `'geojson'｜'table'｜'wkt' ｜ string` | `geojson` |
| features | 初始化数据 | ` Feature[]` | `[]` |
| officialLayers | 官方图层选择 | `string[]` | `[]` |
| theme | 主题配置 | `'light' ｜ 'dark'` | `'light'` |
| locale | 语言设置 | `'zh-CN' ｜ 'en-US'` | `'zh-CN'` |
| coordConvert | 数据转换 | `'GCJ02'｜'WGS84'` | `GCJ02` |
| mapControl | 控件显隐 | [MapControlProps](#mapcontrolprops) | `-` |
| toolbar | 头部组件显隐 | [ToolbarProps](#toolbarprops) | `-` |
| tabItems | 侧面版标签页选项卡内容 | [TabItemType](https://ant-design.antgroup.com/components/tabs-cn#tabitemtype) | `-` |
| showTextLayer | 是否展示元素文本 | `boolean` | `false` |
| textLayerFields | 展示元素文本的字段，不选则展示元素序号 | `string[] &#124; undefined` | `undefined` |
| wasmPath | sam 组件的 wasm 路径 | `string` | `\` |
| showDrawDistance | 绘制时是否展示距离文本 | `boolean` | `false` |
| showDrawArea | 绘制时是否展示面积文本 | `boolean` | `false` |
| customTiles | 自定义瓦片底图图层 | [customTilesProps](#customtilesprops) | `[]` |

#### `tabItems`

侧面版标签页选项卡内容，可以自定义拓展组件

#### 组件

搭配`tabItems`一起使用，用来展示右侧面板功能

#### GeoJsonEditor

GeoJSON 文本编辑器，可以通过输入 GeoJSON 数据来实现数据展示

**<font color=red>要使用该组件得在 webpack 里面配置 以下这段代码 否则就会导致代码格式化失效，代码高亮丢失</font>**

```ts
import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';

  chainWebpack: (config: any) => {
    config.plugin('monaco-editor').use(MonacoEditorWebpackPlugin, [
      {
        languages: ['json'],
      },
    ]);
  },
```

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

#### `customTilesProps`

```js
{
  customTiles: [
    {
      id: 'GaodeSatellite',
      image: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*zi2jSqqZ2-8AAAAAAAAAAAAADjWqAQ/original',
      title: '高德卫星底图',
      layers: [' https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'],
    },
  ];
}
```

| 属性   | 描述         | 类型       |
| ------ | ------------ | ---------- |
| id     | 唯一标识     | `string`   |
| image  | 图片         | `string`   |
| title  | 图层名称     | `string`   |
| layers | 瓦片图层链接 | `string[]` |

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

| 属性                        | 描述                 |
| --------------------------- | -------------------- |
| drawControl                 | 绘制控件             |
| clearControl                | 清除控件             |
| zoomControl                 | 缩放器控件           |
| scaleControl                | 比例尺控件           |
| locationSearchControl       | 地点搜索控件         |
| mouseLocationControl        | 光标经纬度控件       |
| filterControl               | 数据过滤控件         |
| officialLayerControl        | 官方图层控制控件     |
| mapThemeControl             | 图层主题控件         |
| geoLocateControl            | 定位控件             |
| layerColorControl           | 图层颜色控制控件     |
| autoControl                 | 自适应控件           |
| fullscreenControl           | 全屏控件             |
| administrativeSelectControl | 行政区域选择控件     |
| mapAdministrativeControl    | 查看当前行政区域控件 |
| logoControl                 | Logo 控件            |
| textLayerControl            | 文本图层 控件        |

#### toolbar

控制显示隐藏头部组件

```js
{
  toolbar = {{logo: false}}
}
```

#### ToolbarProps

| 属性     | 描述     |
| -------- | -------- |
| logo     | logo     |
| baseMap  | 底图切换 |
| import   | 上传     |
| download | 下载     |
| guide    | 引导     |
| help     | 帮助     |
| setting  | 设置     |
| theme    | 主题     |
| dingTalk | 钉钉群   |
| i18n     | 语言切换 |

#### `onFeatureChange`

数据变化时的监听方法

```js
    onFeatureChange={(features: Feature[]) => {}}
```
