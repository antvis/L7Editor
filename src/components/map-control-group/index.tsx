import {
  FullscreenControl,
  GeoLocateControl,
  MouseLocationControl,
  ScaleControl,
  ZoomControl,
} from '@antv/larkmap';
import React from 'react';
import { useGlobal } from '../../recoil';
import { AdministrativeSelectControl } from './administer';
import DrawControl from './draw-control';
import FilterControl from './filter-form-list-control';
import LayerColorControl from './layer-color-control';
import LocationSearchControl from './location-search-control';
import MapThemeControl from './map-theme-control';
import { OfficialLayerControl } from './official-layer-control';
// import SaveMapOptionsControl from './save-map-options-control';

export const MapControlGroup: React.FC = ({}) => {
  const { baseMap } = useGlobal();

  return (
    <>
      <DrawControl />
      <AdministrativeSelectControl />
      <ZoomControl />
      <ScaleControl />
      <LocationSearchControl />
      <MouseLocationControl />
      {baseMap === 'Gaode' && <OfficialLayerControl />}
      <MapThemeControl />
      <GeoLocateControl position="bottomright" />
      <LayerColorControl />
      <FullscreenControl position="bottomright" />
      <FilterControl />
    </>
  );
};
