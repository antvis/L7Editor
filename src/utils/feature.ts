import type { Feature, LineString, Point } from '@turf/turf';
import { length, lineSliceAlong, point } from '@turf/turf';
import { last } from 'lodash-es';

export const centerOfLine = (line: Feature<LineString>): Feature<Point> => {
  const lineLength = length(line, {
    units: 'meters',
  });
  const position = last(
    lineSliceAlong(line, 0, lineLength / 2, {
      units: 'meters',
    }).geometry.coordinates,
  )!;
  return point(position);
};
