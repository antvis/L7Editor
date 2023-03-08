import { MapThemeControl as LarkMapMapThemeControl } from '@antv/larkmap';
import React from 'react';
import { useModel } from 'umi';

const MapThemeControl: React.FC = () => {
  const { setMapOptions } = useModel('global');

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
