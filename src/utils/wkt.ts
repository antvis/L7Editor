import type { FeatureCollection, Geometry } from '@turf/turf';
import { feature, featureCollection } from '@turf/turf';
import type { GeoJSONGeometry } from 'wellknown';
import { parse, stringify } from 'wellknown';

export function GeoJSON2Wkt(fc: FeatureCollection): string {
  return (
    fc.features
      .map((item) => {
        return stringify(item.geometry as GeoJSONGeometry);
      })
      .join(';')
      //@ts-ignore
      .replaceAll(' (', '(')
      .replaceAll(', ', ',')
  );
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
