import {
  Feature,
  FeatureCollection,
  Position,
  coordAll,
  point,
} from '@turf/turf';
import { message } from 'antd';
import { LngLatVT } from '../constants';

export function GeoJSONtoLngLat(fc: FeatureCollection) {
  const feature = coordAll(fc)
    .map((item: any[]) => item.join(','))
    .join(';');

  return feature;
}

export function LngLattoGeoJson(text: string) {
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
    newFeatures.push(
      ...featurePositionList.flat().map((position) => point(position)),
    );
    return newFeatures;
  }
}
