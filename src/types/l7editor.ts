import { LarkMapProps } from "@antv/larkmap";
import { IFeature, LngLatImportType } from ".";

export type L7EditorProps = {
  onFeatureChange?: (feature: IFeature) => void;

  editConfig: {
    /**
      * 图层颜色
      * @default #1677ff
      */
    primaryColor?: string;
    /**
     * 地图
     * @default Gaode
     */
    baseMap: 'Gaode' | 'Mapbox';
    /**
     * 侧边栏宽度 (40%)
     * @default 40
     */
    rightWidth?: number;
    /**
     * 地图配置 
     * @default  {}
     */
    mapOption: LarkMapProps['mapOptions'];
    /**
     * autoFitBounds
     * @default true
     */
    autoFitBounds?: boolean;
    /**
     * 图层popup触发方式
     * @default click
     */
    popupTrigger?: 'click' | 'hover';
    /**
     * panel 展示tab
     * @default code
     */
    activeTab?: 'code' | 'table';
    /**
     * lnglatType
     * @default Point
     */
    lnglatType?: LngLatImportType
  }


}