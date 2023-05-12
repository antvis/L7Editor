import { LngLatImportType } from '@/types';
import { createFromIconfontCN } from '@ant-design/icons';

export const RightPanelWidthRange = [20, 80];

export enum LocalstorageKey {
  RightPanelWidth = 'RightPanelWidth',
  MapOptions = 'MapOptions',
  LayerColor = 'LayerColor',
  HideEditor = 'HideEditor',
  EditorText = 'EditorText',
  PopupTrigger = 'PopupTrigger',
  ActiveRightTabKey = 'ActiveRightTabKey',
  AutoFitBounds = 'AutoFitBounds',
  BaseMap = 'BaseMap',
}

export enum LayerId {
  PointLayer = 'PointLayer',
  LineLayer = 'LineLayer',
  PolygonLayer = 'PolygonLayer',
}

export * from './variable-type';
export const dingGroupImg =
  'https://mdn.alipayobjects.com/huamei_baaa7a/afts/img/A*mvwjR5RwS9QAAAAAAAAAAAAADqSCAQ/original';

export const PrimaryColor = '#1677ff';

export const FeatureKey = {
  Index: Symbol('index'),
  DrawType: Symbol('drawType'),
  IsEdit: Symbol('isEdit'),
};

export const LngLatImportTypeOptions: Array<{
  label: string;
  value: LngLatImportType;
  placeholder: string;
}> = [
  {
    label: '点',
    value: 'Point',
    placeholder:
      '请输入连续的点经纬度，经度和纬度之间用","隔开，不同经纬度点之间用";"隔开，例如：\n120.85,30.26;130.85,31.21',
  },
  {
    label: '线',
    value: 'LingString',
    placeholder:
      '请输入连续的线经纬度，经度和纬度之间用","隔开，不同经纬度点之间用";"隔开，不同的线之间用"\\n"隔开，例如：\n120.85,30.26;130.85,31.21\n121.31,30.21;126,21',
  },
  {
    label: '面',
    value: 'Polygon',
    placeholder:
      '请输入连续的面经纬度，经度和纬度之间用","隔开，不同经纬度点之间用";"隔开，不同的面之间用"\\n"隔开，例如：\n120.85,30.26;130.85,31.21;121.85,23.85;120.85,30.26\n122.82,10.12;121.23,12.45;100.12,23.12;122.82,10.12',
  },
];

export const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_3567033_cxg3z3f6vte.js',
});

export const MapBoxConfig = {
  style: 'mapbox://styles/zcxduo/ck2ypyb1r3q9o1co1766dex29',
  token:
    'pk.eyJ1IjoibGl1dmlnb25nenVvc2hpIiwiYSI6ImNsaGs2czBrcTBvczUzbnFzOHU0dzk2ZWQifQ.hVvTgcbg_Ym-VQz36psLRg',
};
