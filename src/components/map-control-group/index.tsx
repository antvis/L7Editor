import {
  FullscreenControl,
  MouseLocationControl,
  ScaleControl,
  ZoomControl,
} from '@antv/larkmap';
import React from 'react';
import LayerColorControl from './layer-color-control';
import LocationSearchControl from './location-search-control';
import MapThemeControl from './map-theme-control';
import DrawControl from './draw-control';
// import SaveMapOptionsControl from './save-map-options-control';

export const MapControlGroup: React.FC = ({}) => {
  return (
    <>
      <DrawControl />
      <ZoomControl />
      <ScaleControl />
      <LocationSearchControl />
      <MouseLocationControl />
      <MapThemeControl />
      {/*<SaveMapOptionsControl />*/}
      <LayerColorControl />
      <FullscreenControl position="bottomright" />
    </>
  );
};
