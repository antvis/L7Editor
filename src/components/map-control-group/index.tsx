import {
  FullscreenControl,
  GeoLocateControl,
  LogoControl,
  MouseLocationControl,
  ScaleControl,
  ZoomControl,
} from '@antv/larkmap';
import React, { useEffect, useState } from 'react';
import { OfficeLayerEnum } from '../../constants';
import { useGlobal } from '../../recoil';
import type { MapControlProps } from '../../types/l7editor';
import { AdministrativeSelect } from './administrative-select-control';
import { AutoControl } from './auto-control';
import { ClearControl } from './clear-control';
import DrawControl from './draw-control';
import { ExportImage } from './export-image-control';
import FilterControl from './filter-form-list-control';
import { L7MapOptionControl } from './l7-option-control';
import LayerColorControl from './layer-color-control';
import LocationSearchControl from './location-search-control';
import { MapAdministrativeControl } from './map-administrative-control';
import MapThemeControl from './map-theme-control';
import { OfficialLayerControl } from './official-layer-control';
import { SamControl } from './sam-control';
import useStyles from './styles';
import { TextLayerControl } from './text-layer-control';

type MapControlGroupProps = {
  mapControl?: MapControlProps;
};
const DefaultMapControl: MapControlProps = {
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
  administrativeSelectControl: true,
  mapAdministrativeControl: true,
  logoControl: true,
  textLayerControl: true,
  exportImageControl: true,
  L7MapOptionControl: true,
};
export const MapControlGroup: React.FC<MapControlGroupProps> = ({
  mapControl,
}) => {
  const { baseMap, layerType } = useGlobal();
  const styles = useStyles();
  const [isControlGroupState, setIsControlGroup] = useState(DefaultMapControl);

  useEffect(() => {
    setIsControlGroup({ ...DefaultMapControl, ...mapControl });
  }, [mapControl]);

  return (
    <>
      {isControlGroupState.logoControl && <LogoControl position="leftbottom" />}
      {isControlGroupState.scaleControl && (
        <ScaleControl position="leftbottom" className={styles.scalesControl} />
      )}
      {isControlGroupState.mouseLocationControl && (
        <MouseLocationControl
          position="leftbottom"
          className={styles.mouseLocatio}
        />
      )}
      {isControlGroupState.drawControl && <DrawControl />}
      {isControlGroupState.clearControl && <ClearControl />}
      {isControlGroupState.zoomControl && (
        <ZoomControl className={styles.zoom} showZoom position="rightbottom" />
      )}
      {isControlGroupState.mapAdministrativeControl && (
        <MapAdministrativeControl />
      )}
      {isControlGroupState.administrativeSelectControl && (
        <AdministrativeSelect />
      )}
      {isControlGroupState.locationSearchControl && <LocationSearchControl />}
      {isControlGroupState.filterControl && <FilterControl />}
      {baseMap === 'Gaode' && isControlGroupState.officialLayerControl && (
        <OfficialLayerControl />
      )}
      {isControlGroupState.mapThemeControl &&
        (baseMap === 'Gaode' || baseMap === 'Mapbox') && <MapThemeControl />}
      {isControlGroupState.geoLocateControl && (
        <GeoLocateControl position="topleft" className={styles.fullScreen} />
      )}
      {isControlGroupState.layerColorControl && <LayerColorControl />}
      {isControlGroupState.autoControl && <AutoControl />}
      {isControlGroupState.fullscreenControl && (
        <FullscreenControl
          position="bottomright"
          className={styles.fullScreen}
        />
      )}
      {layerType.includes(OfficeLayerEnum.GoogleSatellite) && <SamControl />}
      {isControlGroupState.textLayerControl && <TextLayerControl />}
      {isControlGroupState.exportImageControl && <ExportImage />}
      {isControlGroupState.L7MapOptionControl && <L7MapOptionControl />}
    </>
  );
};
