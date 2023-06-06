import { FeatureKey } from '@/constants';
import { Feature, Geometry, GeometryCollection } from '@turf/turf';

export type LngLatImportType = 'Point' | 'LingString' | 'Polygon';

export type IFeature = Feature<
  Geometry | GeometryCollection,
  {
    // @ts-ignore
    [FeatureKey.Index]: number;
  }
>[];
