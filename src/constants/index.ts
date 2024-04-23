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

export const CN_GOOGLE_TILE_MAP_URL =
  'https://gwxc.shipxy.com/tile.g?z={z}&x={x}&y={y}';

export const GOOGLE_TILE_MAP_URL =
  'https://mt0.google.com/vt/lyrs=s&gl=CN&x={x}&y={y}&z={z}';

export const GOOGLE_TILE_MAP_ROUTER_URL =
  'https://mt0.google.com/vt/lyrs=h&gl=CN&x={x}&y={y}&z={z}';

export const GAODE_TILE_MAP_URL =
  'https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}';

export enum OfficeLayerEnum {
  GoogleSatellite = 'googleSatellite',
  Google = 'Google',
  VectorMap = 'vectorMap',
  Gaode = 'Gaode',
}
