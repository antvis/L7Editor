import { MapThemeControl as LarkMapMapThemeControl } from '@antv/larkmap';
import React from 'react';
import { useGlobal } from '../../../recoil';
import useStyle from './styles';

const MapThemeControl: React.FC = () => {
  const { setMapOptions } = useGlobal();
  const styles = useStyle();

  return (
    <LarkMapMapThemeControl
      className={styles.mapTheme}
      popperClassName={styles.mapThemePopper}
      position="bottomright"
      onSelectChange={(style) => {
        setMapOptions((oldMapOptions) => {
          return {
            ...oldMapOptions,
            style,
          };
        });
      }}
    />
  );
};

export default MapThemeControl;
