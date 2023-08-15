import { MenuProps, TourProps } from 'antd';
import React from 'react';

export const logs = [
  {
    label: '2023-05-12',
    children: '设置中增加mapbox底图',
  },
  {
    label: '2023-05-31',
    children: '添加谷歌卫星遥感图层',
  },
];

export const HandBackMenuItems: MenuProps['items'] = [
  {
    key: 'text',
    label: '平台使用文档',
  },
  {
    key: 'api',
    label: '组件API文档',
  },
  {
    key: 'changeLog',
    label: '更新日志',
  },
  {
    key: 'ding',
    label: '联系我们',
  },
];

export const DownloadMenuItems: MenuProps['items'] = [
  {
    key: 'GeoJson',
    label: '下载 GeoJSON 格式数据',
  },
  // {
  //   key: 'FormatGeoJson',
  //   label: '下载格式化的 GeoJson 格式数据',
  // },
  {
    key: 'LngLat',
    label: '下载 LngLat 格式数据',
  },
  // {
  //   key: 'Text',
  //   label: '下载当前编辑器输入数据',
  // },
  {
    key: 'KML',
    label: '下载 KML 格式数据',
  },
  {
    key: 'WKT',
    label: '下载 WKT 格式数据',
  },
];

export const DropdownMenuItems: MenuProps['items'] = [
  {
    key: 'basics',
    label: '平台基础使用文档',
  },
  {
    key: 'function',
    label: '全功能使用引导',
  },
];

export const steps: TourProps['steps'] = [
  {
    title: '上传',
    description: '上传 GeoJSON 数据',
    cover: (
      <img
        alt="上传.png"
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    target: () => document.getElementById('l7-editor-upload')!,
  },
  {
    title: '编辑器',
    description: '可以通过编辑器修改 GeoJSON 数据',
    target: () => document.getElementById('l7-editor-panel')!,
    placement: 'left',
  },
  {
    title: '绘制',
    cover: (
      <img
        alt="绘制.png"
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    description: '可以激活地图绘制新增 GeoJSON 元素',
    target: () => document.getElementById('l7-editor-draw')!,
    placement: 'right',
  },
  {
    title: '保存',
    description:
      '使用 Ctrl/Command + S 快捷键，或点击保存按钮渲染数据（已保存状态下保存按钮置灰）',
    target: () => document.getElementById('l7-editor-save')!,
  },
  {
    title: '渲染',
    description: '地图上查看渲染效果',
    target: () => document.getElementById('l7-editor-map')!,
    placement: 'right',
  },
];

export const functionSteps: TourProps['steps'] = [
  {
    title: '上传',
    description: '上传 GeoJSON 数据',
    cover: (
      <img
        alt="上传.png"
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    target: () => document.getElementById('l7-editor-upload')!,
  },
  {
    title: '保存',
    description:
      '使用 Ctrl/Command + S 快捷键，或点击保存按钮渲染数据（已保存状态下保存按钮置灰）',
    target: () => document.getElementById('l7-editor-save')!,
  },
  {
    title: '清除',
    description:
      '点击清除按钮 GeoJSON 数据将被请空 （已清空状态下清空按钮置灰）',
    target: () => document.getElementById('l7-editor-clear')!,
  },
  {
    title: '自动缩放',
    description: '点击自动缩放按钮 地图将自动缩放的 GeoJSON 数据位置',
    target: () => document.getElementById('l7-editor-auto')!,
  },
  {
    title: '下载',
    description: '点击下载可将 GeoJSON 数据下载为指定数据格式',
    target: () => document.getElementById('l7-editor-download')!,
  },
  {
    title: '设置',
    description: '用户可设置一些初始化配置',
    target: () => document.getElementById('l7-editor-set')!,
  },
  {
    title: '绘制',
    cover: (
      <img
        alt="绘制.png"
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    description: '可以激活地图绘制新增 GeoJSON 元素',
    target: () => document.getElementById('l7-editor-draw')!,
    placement: 'right',
  },
  {
    title: '城市查询',
    description: '搜索城市后可快速定位并移动至对应城市中心点',
    target: () => document.getElementById('l7-editor-citySelect')!,
  },
  {
    title: '筛选',
    description: '可根据数据中的properties来筛选需要数据',
    target: () => document.getElementById('l7-editor-filter')!,
  },
  {
    title: '底图',
    description: '可选择不同的地图底图配置',
    target: () => document.getElementById('l7-editor-aMap')!,
  },
  {
    title: '主题色',
    description: '选择不同主题色来修改地图渲染主题颜色',
    //@ts-ignore
    target: () => document.getElementsByClassName('l7-editor-theme')[0]!,
  },
  {
    title: '颜色选择器',
    description: '选择颜色来修改地图渲染颜色',
    target: () => document.getElementById('l7-editor-color')!,
  },
  {
    title: '编辑器',
    description: '可以通过编辑器修改 GeoJSON 数据',
    target: () => document.getElementById('l7-editor-panel')!,
    placement: 'left',
  },
  {
    title: '表格',
    description:
      '可以通过表格来展示修改删除GeoJSON 数据中的properties对象中的字段',
    target: () => document.getElementById('l7-editor-table')!,
    placement: 'left',
  },
];
