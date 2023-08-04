import { L7Editor } from '@antv/l7-editor';
import './index.less';

import { Feature } from '@turf/turf';
import React from 'react';

export default () => {
  return (
    <div className="content">
      <L7Editor
        onFeatureChange={(feature: Feature[]) => {
          console.log('onFeatureChange', feature);
        }}
      />
    </div>
  );
};
