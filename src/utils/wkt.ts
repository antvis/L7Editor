import { FeatureCollection, Geometry, feature, featureCollection } from '@turf/turf';
import { GeoJSONGeometry, parse, stringify } from 'wellknown';

export function GeoJSON2Wkt(fc: FeatureCollection): string {
  return fc.features
    .map((feature) => {
      return stringify(feature.geometry as GeoJSONGeometry);
    })
    .join(';');
}

export function Wkt2GeoJSON(wkt: string): FeatureCollection {
  const fc = featureCollection([]);
  wkt.split(/[;\n]/g).forEach((item) => {
    if (item) {
      const geometry = parse(item) as Geometry;
      if (geometry) {
        fc.features.push(feature(geometry, {}));
      }
    }
  });
  return fc;
}
