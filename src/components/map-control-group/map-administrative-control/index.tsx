import { CustomControl, RegionLocation } from '@antv/larkmap';
import classNames from 'classnames';
import React from 'react';
import useStyle from './styles';

export const MapAdministrativeControl: React.FC = () => {
  const styles = useStyle();

  return (
    <CustomControl
      className={classNames([
        'map-administrative-control',
        styles.mapAdministrative,
      ])}
      position="leftbottom"
    >
      <RegionLocation
        searchParams={{ key: '98d10f05a2da96697313a2ce35ebf1a2' }}
        className={styles.regionLocation}
      />
    </CustomControl>
  );
};
