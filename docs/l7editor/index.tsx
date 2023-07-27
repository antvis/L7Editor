import { L7Editor } from '@antv/l7-editor';
import './index.less';

import { Feature } from '@turf/turf';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    fetch(
      'https://mdn.alipayobjects.com/meshy_cmder/afts/file/A*KXLZTKHYXMYAAAAAAAAAAAAADql2AA?t=5gsmUYr5DrwSDbmR6uhVf0QVXSDvJpmCqjBEHx0uGl4DAAAAZAAAdqlkwO6F',
    )
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
      });
  }, []);
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
        }}
        onFeatureChange={(feature: Feature[]) => {
          console.log('onFeatureChange', feature);
        }}
      />
    </div>
  );
};
