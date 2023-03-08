import {
  FeatureCollectionVT,
  FeatureListVT,
  FeatureVT,
  GeometryListVT,
  GeometryVT,
} from '@/constants';
import { Feature, feature } from '@turf/turf';

export const transformFeatures: (input: string) => Feature[] = (input) => {
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
    console.warn('未识别 JSON 数组类型');
    return [];
  }
  if (FeatureVT.check(json)) {
    return [json];
  }
  if (GeometryVT.check(json)) {
    return [feature(json)];
  }
};
