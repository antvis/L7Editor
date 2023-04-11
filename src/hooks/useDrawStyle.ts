import { IStyle } from '@antv/l7-draw';
import { merge } from 'lodash';
import { useModel } from 'umi';

export function useDrawStyle() {
  const { layerColor } = useModel('global');

  const commonStyle: any = {
    normal: {
      color: layerColor,
    },
    hover: {
      color: layerColor,
    },
    active: {
      color: layerColor,
    },
  };

  const colorStyle: IStyle = {
    point: commonStyle,
    line: commonStyle,
    polygon: merge({}, commonStyle, {
      normal: {
        style: {
          opacity: 0.5,
        },
      },
      hover: {
        style: {
          opacity: 0.5,
        },
      },
      active: {
        style: {
          opacity: 0.5,
        },
      },
    }),
    dashLine: commonStyle,
    midPoint: commonStyle,
    text: commonStyle,
  };
  return { colorStyle };
}
