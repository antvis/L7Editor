import { LngLatVT } from '@/constants';
import { Feature, lineString, point, polygon, Position } from '@turf/turf';
import { first, isEqual, last } from 'lodash';
import { useRecoilState } from 'recoil';
import { lnglatTextState, lnglatTypeState } from './atomState';

export default function useLnglat() {
  const [lngLatImportType, setLngLatImportType] =
    useRecoilState(lnglatTypeState);

  const [lngLatText, setLngLatText] = useRecoilState(lnglatTextState);

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
      const newFeatures: Feature[] = [];
      if (lngLatImportType === 'Point') {
        newFeatures.push(
          ...featurePositionList.flat().map((position) => point(position)),
        );
      } else if (lngLatImportType === 'LingString') {
        newFeatures.push(
          ...featurePositionList.map((positions) => lineString(positions)),
        );
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
}
