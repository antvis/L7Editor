import { Feature, feature } from '@turf/turf';
import {
  FeatureCollectionVT,
  FeatureListVT,
  FeatureVT,
  GeometryListVT,
  GeometryVT,
} from '../constants';

export const transformFeatures: (input: string, t: any) => Feature[] = (
  input,
  t,
) => {
  const json = JSON.parse(input) as any;
  if (FeatureCollectionVT.check(json)) {
    return json.features;
  }
  if (Array.isArray(json)) {
    if (FeatureListVT.check(json)) {
      return json;
    }
    if (GeometryListVT.check(json)) {
      return json.map((item) => feature(item));
    }
    console.warn(t('utils.transform.weiShiBieJS'));
    return [];
  }
  if (FeatureVT.check(json)) {
    return [json];
  }
  if (GeometryVT.check(json)) {
    return [feature(json)];
  }
};
