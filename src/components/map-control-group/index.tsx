import {
  FullscreenControl,
  MouseLocationControl,
  ScaleControl,
  ZoomControl,
  useScene,
} from '@antv/larkmap';
import React from 'react';
import { AmapLayerControl } from './amap-layer-control';
import DrawControl from './draw-control';
import FilterFormListControl from './filter-form-list-control';
import LayerColorControl from './layer-color-control';
import LocationSearchControl from './location-search-control';
import MapThemeControl from './map-theme-control';
// import SaveMapOptionsControl from './save-map-options-control';

export const MapControlGroup: React.FC = ({}) => {
  const scene = useScene();

  return (
    <>
      <DrawControl />
      <ZoomControl />
      <ScaleControl />
      <LocationSearchControl />
      <MouseLocationControl />
      {scene.getType() !== 'mapbox' && <AmapLayerControl />}
      <MapThemeControl />
      {/*<SaveMapOptionsControl />*/}
      <LayerColorControl />
      <FullscreenControl position="bottomright" />
      <FilterFormListControl />
    </>
  );
};
