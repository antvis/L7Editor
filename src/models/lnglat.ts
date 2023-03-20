import { useState } from 'react';
import { chunk, first, isEqual, last } from 'lodash';
import { LngLatImportType } from '@/types';
import { useModel } from 'umi';
import { Feature, Position, lineString, point, polygon } from '@turf/turf';
import { LngLatVT } from '@/constants';

export default () => {
  const [lngLatImportType, setLngLatImportType] =
    useState<LngLatImportType>('Point');
  const [lngLatText, setLngLatText] = useState('');
  const { resetFeatures, features } = useModel('feature');

  const importLngLatText = (text: string) => {
    const featurePositionList: Position[][] = text
      .split('\n')
      .filter((item) => item)
      .map((item) =>
        item
          .split(';')
          .filter((item) => item)
          .map((item) =>
            item
              .split(',')
              .filter((item) => item)
              .map((item) => +item),
          ),
      );

    if (LngLatVT.check(featurePositionList)) {
      const newFeatures: Feature[] = [...features];
      if (lngLatImportType === 'Point') {
        newFeatures.push(
          ...featurePositionList.flat().map((position) => point(position)),
        );
      } else if (lngLatImportType === 'LingString') {
        newFeatures.push(...featurePositionList.map((positions) => lineString(positions)));
      } else {
        newFeatures.push(
          ...featurePositionList.map((positions) => {
            if (!isEqual(first(positions), last(positions))) {
              positions.push(positions[0]!);
            }
            return polygon([positions]);
          }),
        );
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
