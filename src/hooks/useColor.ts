import { merge } from 'lodash';
import { useModel } from 'umi';

export function useColor() {
  const { layerColor } = useModel('global');

  const commonStyle = {
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

  const colorStyle = {
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
  };
  return { colorStyle };
}
