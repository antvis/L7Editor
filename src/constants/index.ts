export const RightPanelWidthRange = [20, 80];

export enum LocalStorageKey {
  RightPanelWidth = 'RightPanelWidth',
  MapOptions = 'MapOptions',
  LayerColor = 'LayerColor',
  HideEditor = 'HideEditor',
  EditorText = 'EditorText',
  PopupTrigger = 'PopupTrigger',
  ActiveRightTabKey = 'ActiveRightTabKey',
  AutoFitBounds = 'AutoFitBounds',
  BaseMap = 'BaseMap',
  officialLayers = 'officialLayers',
  WktText = 'WktText',
  Convert = 'Convert',
  theme = 'theme',
  cityHistory = 'cityHistory',
  showTextLayer = 'showTextLayer',
  textLayerFields = 'textLayerFields',
  locale = 'locale',
  firstOpening = 'firstOpening',
  wasmPath = 'wasmPath',
  customTiles = 'customTiles',
  showDrawDistance = 'showDrawDistance',
  showDrawArea = 'showDrawArea',
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

export const MapBoxConfig = {
  token:
    'pk.eyJ1IjoibGl1dmlnb25nenVvc2hpIiwiYSI6ImNsaGs2czBrcTBvczUzbnFzOHU0dzk2ZWQifQ.hVvTgcbg_Ym-VQz36psLRg',
  WebGLParams: {
    preserveDrawingBuffer: true,
  },
};

export const GaodeConfig = {
  token: '5ae4492ef912cbbc93034fea0e66ff2a',
  WebGLParams: {
    preserveDrawingBuffer: true,
  },
};

export const LayerZIndex = 100;

export const GOOGLE_TILE_MAP_URL =
  'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}';

export const GOOGLE_TILE_MAP_ROUTER_URL =
  'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=h&gl=CN&x={x}&y={y}&z={z}';

export enum OfficeLayerEnum {
  GoogleSatellite = 'googleSatellite',
  VectorMap = 'vectorMap',
}
