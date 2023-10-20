import type { Feature } from '@turf/turf';
import gcoord from 'gcoord';

export const wgs84togcj02 = (feature: Feature) => {
  if (feature.geometry.type.match(/polygon/i)) {
    feature.geometry = JSON.parse(JSON.stringify(feature.geometry));
  }
  // @ts-ignore
  return gcoord.transform(feature, gcoord.WGS84, gcoord.GCJ02) as Feature;
};

export const gcj02towgs84 = (feature: Feature) => {
  if (feature.geometry.type.match(/polygon/i)) {
    feature.geometry = JSON.parse(JSON.stringify(feature.geometry));
  }
  // @ts-ignore
  return gcoord.transform(feature, gcoord.GCJ02, gcoord.WGS84) as Feature;
};
