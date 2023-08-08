import { MenuProps } from 'antd';

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
    label: '平台文档',
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
    label: '联系方式',
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
