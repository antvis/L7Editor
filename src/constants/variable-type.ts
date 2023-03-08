import VT from 'variable-type';

export const GeometryVT = VT.shape({
  type: VT.in([
    'Point',
    'LineString',
    'Polygon',
    'MultiPoint',
    'MultiLineString',
    'MultiPolygon',
  ]),
  coordinates: VT.array,
});

export const GeometryListVT = VT.arrayOf(GeometryVT);

export const FeatureVT = VT.shape({
  type: VT.in(['Feature']),
  properties: VT.or([VT.object, VT.null, VT.undefined]),
  geometry: GeometryVT,
});

export const FeatureListVT = VT.arrayOf(FeatureVT);

export const FeatureCollectionVT = VT.shape({
  type: VT.in(['FeatureCollection']),
  features: VT.arrayOf(FeatureVT),
});

export const LngLatVT = VT.arrayOf(
  VT.and([
    VT.arrayOf(VT.number),
    VT.apply((position: number[]) => {
      if (position.length === 2) {
        const [lng, lat] = position;
        return lng >= -180 && lng <= 180 && lat <= 90 && lat >= -90;
      }
      return false;
    }),
  ]),
);
