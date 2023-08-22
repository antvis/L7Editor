import { Feature } from '@turf/turf';
import gcoord from 'gcoord';
import { cloneDeep } from 'lodash';
import { useGlobal } from '../recoil';

export const useTransformFeatures = () => {
  const { baseMap, coordConvert } = useGlobal();

  const transformFeatures = (features: Feature[]) => {
    let data = cloneDeep(features);
    if (coordConvert === 'WGS84' && baseMap === 'Gaode') {
      data = features.map((item) => {
        const newItem = gcoord.transform(
          cloneDeep(item as any),
          gcoord.WGS84,
          gcoord.GCJ02,
        );
        return newItem;
      });
    } else if (coordConvert === 'GCJ02' && baseMap === 'Mapbox') {
      data = features.map((item) => {
        const newItem = gcoord.transform(
          cloneDeep(item as any),
          gcoord.GCJ02,
          gcoord.WGS84,
        );
        return newItem;
      });
    }
    return data;
  };

  const revertFeatures = (features: Feature[]) => {
    let data = cloneDeep(features);
    if (coordConvert === 'WGS84' && baseMap === 'Gaode') {
      data = features.map((item) => {
        const newItem = gcoord.transform(
          cloneDeep(item as any),
          gcoord.GCJ02,
          gcoord.WGS84,
        );
        return newItem;
      });
    } else if (coordConvert === 'GCJ02' && baseMap === 'Mapbox') {
      data = features.map((item) => {
        const newItem = gcoord.transform(
          cloneDeep(item as any),
          gcoord.WGS84,
          gcoord.GCJ02,
        );
        return newItem;
      });
    }
    return data;
  };

  return {
    transformFeatures,
    revertFeatures,
  };
};
