import {
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '@/components';
import { ConfigProvider } from 'antd';
import React from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import './index.less';

const L7DrawPro: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
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
    </ConfigProvider>
  );
};

export default L7DrawPro;
