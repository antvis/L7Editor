import { FeatureCollectionVT } from '@/constants';
import { LarkMap } from '@antv/larkmap';
import React, { ReactNode, useEffect, useState } from 'react';
import { useModel } from 'umi';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions } = useModel('global');
  const { setScene, saveEditorText, editorText, setEditorText } =
    useModel('feature');

  useEffect(() => {
    if (FeatureCollectionVT.check(JSON.parse(editorText))) {
      saveEditorText();
    } else {
      setEditorText(
        JSON.stringify({ type: 'FeatureCollection', features: [] }, null, 2),
      );
      saveEditorText();
    }
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
