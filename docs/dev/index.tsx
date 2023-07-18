import { L7Editor, IFeature } from '@antv/l7-editor';

import React from 'react';

export default () => {

  return (
    <L7Editor
      editConfig={{ primaryColor: "red" }}
      onFeatureChange={(feature: IFeature) => {
        console.log('onFeatureChange', feature)
      }}
    />
  )
};

