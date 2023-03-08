import { useState } from 'react';
import { chunk, first, isEqual, last } from 'lodash';
import { LngLatImportType } from '@/types';
import { useModel } from 'umi';
import { Feature, lineString, point, polygon } from '@turf/turf';
import { LngLatVT } from '@/constants';

export default () => {
  const [lngLatImportType, setLngLatImportType] =
    useState<LngLatImportType>('Point');
  const [lngLatText, setLngLatText] = useState('');
  const { resetFeatures, features } = useModel('feature');

  const importLngLatText = (text: string) => {
    const positionList = chunk(
      text
        .split(/[^\d.\-]/)
        .filter((item) => item)
        .map((item) => +item),
      2,
    );
    if (LngLatVT.check(positionList)) {
      const newFeatures: Feature[] = [...features];
      if (lngLatImportType === 'Point') {
        newFeatures.push(...positionList.map((position) => point(position)));
      } else if (lngLatImportType === 'LingString') {
        newFeatures.push(lineString(positionList));
      } else {
        if (!isEqual(first(positionList), last(positionList))) {
          positionList.push(positionList[0]);
        }
        newFeatures.push(polygon([positionList]));
      }
      resetFeatures(newFeatures);
      return newFeatures;
    } else {
      throw new Error('LngLat 导入失败');
    }
  };

  return {
    lngLatImportType,
    setLngLatImportType,
    lngLatText,
    setLngLatText,
    importLngLatText,
  };
};
