import {
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '@/components';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useMemo } from 'react';
import './index.less';

const L7DrawPro: React.FC = () => {
  console.log(/Mobi|Android|iPhone/i.test(navigator.userAgent));

  const isPc = useMemo(() => {
    return !/Mobi|Android|iPhone/i.test(navigator.userAgent);
  }, []);
  return isPc ? (
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
  ) : (
    <>显示请用PC端打开</>
  );
};

export default L7DrawPro;
