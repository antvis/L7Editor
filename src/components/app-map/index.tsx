import { LarkMap } from '@antv/larkmap';
import React, { ReactNode } from 'react';
import { useModel } from 'umi';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions } = useModel('global');

  return (
    <LarkMap style={{ height: '100%' }} mapOptions={mapOptions}>
      {children}
    </LarkMap>
  );
};
