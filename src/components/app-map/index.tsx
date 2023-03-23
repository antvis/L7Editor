import { Scene } from '@antv/l7';
import { LarkMap } from '@antv/larkmap';
import React, { ReactNode, useEffect, useState } from 'react';
import { useModel } from 'umi';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions } = useModel('global');
  const { setScene } = useModel('feature');

  return (
    <LarkMap
      style={{ height: '100%' }}
      mapOptions={mapOptions}
      onSceneLoaded={setScene}
    >
      {children}
    </LarkMap>
  );
};
