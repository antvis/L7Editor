import { LarkMapProps } from '@antv/larkmap';
import { Feature } from '@turf/turf';
import { TabsProps } from 'antd';

export interface MapControlProps {
  logoControl: boolean;
  drawControl?: boolean;
  clearControl?: boolean;
  zoomControl?: boolean;
  scaleControl?: boolean;
  locationSearchControl?: boolean;
  mouseLocationControl?: boolean;
  filterControl?: boolean;
  officialLayerControl?: boolean;
  mapThemeControl?: boolean;
  geoLocateControl?: boolean;
  layerColorControl?: boolean;
  autoControl?: boolean;
  fullscreenControl?: boolean;
  administrativeSelectControl?: boolean;
  mapAdministrativeControl?: boolean;
}

export interface ToolbarProps {
  logo?: boolean;
  import?: boolean;
  download?: boolean;
  guide?: boolean;
  help?: boolean;
  setting?: boolean;
  theme?: boolean;
  dingTalk?: boolean;
}

export interface L7EditorProps {
  onFeatureChange?: (feature: Feature[]) => void;

  /**
   * 图层颜色
   * @default '#1677ff'
   */
  primaryColor?: string;
  /**
   * 地图
   * @default 'Gaode'
   */
  baseMap?: 'Gaode' | 'Mapbox';
  /**
   * 侧边栏宽度 (40%)
   * @default 40
   */
  rightPanelWidth?: number;
  /**
   * 地图配置
   * @default  {}
   */
  mapOption?: LarkMapProps['mapOptions'];
  /**
   * autoFitBounds
   * @default true
   */
  autoFitBounds?: boolean;
  /**
   * 图层popup触发方式
   * @default 'click'
   */
  popupTrigger?: 'click' | 'hover';
  /**
   * panel 展示tab
   * @default 'geojson'
   */
  activeTab?: 'geojson' | 'table' | 'wkt' | string;
  /**
   * 初始化数据
   * @default []
   */
  features?: Feature[];
  /**
   * 官方图层选择
   * @default []
   */
  officialLayers?: string[];
  /**
   * 右侧面板是否隐藏
   * @default false
   */
  hidePanel?: boolean;
  /**
   * 标签页item项
   * @default []
   */
  tabs?: TabsProps['items'];
  /**
   * 主题配色
   * @default 'normal'
   */
  theme?: 'normal' | 'dark';
  /**
   * 数据转换
   * @default 'GCJ02'
   */
  coordConvert?: 'GCJ02' | 'WGS84';
  /**
   * 是否显示控件
   */
  mapControl?: MapControlProps;
  /**
   * 是否显示头部组件
   */
  toolbar?: ToolbarProps;
  /**
   * 侧面版TabItems
   */
  tabItems?: TabsProps['items'];
  /**
   * 是否展示元素序号
   * @default false
   */
  showIndex?: boolean;
}
