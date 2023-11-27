import { L7Editor } from '@antv/l7-editor';
import React from 'react';
import './index.less';

export default () => {
  return (
    <div className="editor">
      <L7Editor activeTab="geojson" wasmPath='https://renderofficepre.alipayobjects.com/p/yuyan/180020010001254664/'/>
    </div>
  );
};
