import { MapThemeControl as LarkMapMapThemeControl } from '@antv/larkmap';
import React from 'react';
import { useGlobal } from '../../recoil';

const MapThemeControl: React.FC = () => {
  const { setMapOptions } = useGlobal();

  return (
    <LarkMapMapThemeControl
      className="l7-editor-driver-theme"
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
