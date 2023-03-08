import {
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '@/components';
import React from 'react';
import './index.less';

const L7DrawPro: React.FC = () => {
  return (
    <div className="l7-draw-pro">
      <ResizePanel
        left={
          <AppMap>
            <MapControlGroup />
            <LayerList />
            <LayerPopup />
          </AppMap>
        }
        right={<MapContent />}
      />
    </div>
  );
};

export default L7DrawPro;
