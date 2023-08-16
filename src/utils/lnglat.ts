import {
  Feature,
  FeatureCollection,
  Position,
  coordAll,
  point,
} from '@turf/turf';
import { LngLatVT } from '../constants';

export function GeoJSONtoLngLat(fc: FeatureCollection) {
  const feature = coordAll(fc)
    .map((item: any[]) => item.join(','))
    .join(';');

  return feature;
}

export function LngLattoGeoJson(lngLat: string) {
  const featurePositionList: Position[][] = lngLat
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
