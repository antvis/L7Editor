import { Scene } from '@antv/l7';
import { LarkMap } from '@antv/larkmap';
import React, { ReactNode, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { bbox, featureCollection } from '@turf/turf';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions, autoFitBounds } = useModel('global');
  const { features } = useModel('feature');
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    if (scene && features.length && autoFitBounds) {
      const [lng1, lat1, lng2, lat2] = bbox(featureCollection(features));
      scene.fitBounds([
        [lng1, lat1],
        [lng2, lat2],
      ]);
    }
  }, [features, scene]);

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
