import type { Feature, FeatureCollection, Position } from '@turf/turf';
import { coordAll, point } from '@turf/turf';
import { LngLatVT } from '../constants';

export function GeoJSON2LngLat(fc: FeatureCollection) {
  const feature = coordAll(fc)
    .map((item: any[]) => item.join(','))
    .join(';');

  return feature;
}

export function LngLat2GeoJson(lngLat: string) {
  const featurePositionList: Position[][] = lngLat
    .split('\n')
    .filter((item) => item)
    .map((item) =>
      item
        .split(';')
        .filter((str) => str)
        .map((str) =>
          str
            .split(',')
            .filter((num) => num)
            .map((num) => +num),
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
