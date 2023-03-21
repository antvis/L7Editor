import {
  FullscreenControl,
  MouseLocationControl,
  ScaleControl,
  ZoomControl,
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
  return (
    <>
      <DrawControl />
      <ZoomControl />
      <ScaleControl />
      <LocationSearchControl />
      <MouseLocationControl />
      <AmapLayerControl/>
      <MapThemeControl />
      {/*<SaveMapOptionsControl />*/}
      <LayerColorControl />
      <FullscreenControl position="bottomright" />
      <FilterFormListControl />
    </>
  );
};
