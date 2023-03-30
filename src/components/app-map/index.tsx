import { LarkMap } from '@antv/larkmap';
import React, { ReactNode, useEffect, useState } from 'react';
import { useModel } from 'umi';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions } = useModel('global');
  const { setScene, saveEditorText } = useModel('feature');

  useEffect(() => {
    saveEditorText();
  }, []);

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
