import {
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '@/components';
import { ConfigProvider, Result } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useMemo } from 'react';
import { RecoilEnv, RecoilRoot } from 'recoil';
import './index.less';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const L7DrawPro: React.FC = () => {
  const isPc = useMemo(() => {
    return !/Mobi|Android|iPhone/i.test(navigator.userAgent);
  }, []);

  return isPc ? (
    <RecoilRoot>
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
    </RecoilRoot>
  ) : (
    <Result status="404" title="请用PC端打开" />
  );
};

export default L7DrawPro;
