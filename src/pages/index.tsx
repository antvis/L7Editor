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
import useStyle from './styles';

const L7DrawPro: React.FC = () => {
  const styles = useStyle();
  const isPc = useMemo(() => {
    return !/Mobi|Android|iPhone/i.test(navigator.userAgent);
  }, []);

  return isPc ? (
    <ConfigProvider locale={zhCN}>
      <div className={styles.l7DrawPro}>
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
    <Result status="404" title="请用PC端打开" />
  );
};

export default L7DrawPro;
