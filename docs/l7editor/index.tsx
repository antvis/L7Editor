import { L7Editor } from '@antv/l7-editor';
import './index.less';

import { Feature } from '@turf/turf';
import React from 'react';

export default () => {
  return (
    <div className="content">
      <L7Editor
        editorConfig={{
          primaryColor: 'red',
          feature: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [116.566533, 40.051842],
                      [116.820412, 39.638291],
                      [116.220022, 39.617151],
                      [116.566533, 40.051842],
                    ],
                  ],
                },
              },
            ],
          },
          tabs: [
            {
              key: '1',
              label: <div>拓展1</div>,
              children: <>111</>,
            },
          ],
        }}
        onFeatureChange={(feature: Feature[]) => {
          console.log('onFeatureChange', feature);
        }}
      />
    </div>
  );
};
