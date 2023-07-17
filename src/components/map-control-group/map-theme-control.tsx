import { useGlobal } from '@/recoil';
import { MapThemeControl as LarkMapMapThemeControl } from '@antv/larkmap';
import React from 'react';

const MapThemeControl: React.FC = () => {
  const { setMapOptions } = useGlobal();

  return (
    <LarkMapMapThemeControl
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
