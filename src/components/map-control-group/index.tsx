import {
  FullscreenControl,
  GeoLocateControl,
  MouseLocationControl,
  ScaleControl,
  ZoomControl,
} from '@antv/larkmap';
import React, { useEffect, useState } from 'react';
import { mapControlProps } from 'src/types/l7editor';
import { useGlobal } from '../../recoil';
import { AutoControl } from './auto-control';
import { ClearControl } from './clear-control';
import DrawControl from './draw-control';
import FilterControl from './filter-form-list-control';
import LayerColorControl from './layer-color-control';
import LocationSearchControl from './location-search-control';
import MapThemeControl from './map-theme-control';
import { OfficialLayerControl } from './official-layer-control';
import useStyle from './styles';
// import SaveMapOptionsControl from './save-map-options-control';

type MapControlGroupProps = {
  mapControl?: mapControlProps;
};
const isControGroup = {
  drawControl: true,
  clearControl: true,
  zoomControl: true,
  scaleControl: true,
  locationSearchControl: true,
  mouseLocationControl: true,
  filterControl: true,
  officialLayerControl: true,
  mapThemeControl: true,
  geoLocateControl: true,
  layerColorControl: true,
  autoControl: true,
  fullscreenControl: true,
};
export const MapControlGroup: React.FC<MapControlGroupProps> = ({
  mapControl,
}) => {
  const { baseMap } = useGlobal();
  const styles = useStyle();
  const [isControGroupState, setIsControGroup] = useState(isControGroup);

  useEffect(() => {
    setIsControGroup({ ...isControGroup, ...mapControl });
  }, [mapControl]);

  return (
    <>
      {isControGroupState.drawControl && <DrawControl />}
      {isControGroupState.clearControl && <ClearControl />}
      {isControGroupState.zoomControl && (
        <ZoomControl className={styles.zoom} />
      )}
      {isControGroupState.scaleControl && (
        <ScaleControl className={styles.scalesControl} />
      )}
      {isControGroupState.locationSearchControl && <LocationSearchControl />}
      <MouseLocationControl className={styles.fullScreen} />
      <FilterControl />
      {baseMap === 'Gaode' && isControGroupState.officialLayerControl && (
        <OfficialLayerControl />
      )}
      {isControGroupState.mapThemeControl && <MapThemeControl />}
      {isControGroupState.geoLocateControl && (
        <GeoLocateControl
          position="bottomright"
          className={styles.fullScreen}
        />
      )}
      {isControGroupState.layerColorControl && <LayerColorControl />}
      {isControGroupState.autoControl && <AutoControl />}
      {isControGroupState.fullscreenControl && (
        <FullscreenControl
          position="bottomright"
          className={styles.fullScreen}
        />
      )}
    </>
  );
};
