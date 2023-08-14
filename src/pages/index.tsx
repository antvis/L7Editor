import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useEffect } from 'react';
import {
  AppHeader,
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '../components';
import { useGlobal } from '../recoil';
import { L7EditorProps } from '../types';
import useStyle from './styles'
import classNames from 'classnames';

export const Editor = (props: L7EditorProps) => {
  const styles = useStyle();
  const { onFeatureChange } = props;
  const { theme: antdTheme, mapOptions, setMapOptions } = useGlobal();

  useEffect(() => {
    if (antdTheme === 'normal') {
      setMapOptions({ ...mapOptions, style: 'normal' });
    } else {
      setMapOptions({ ...mapOptions, style: 'dark' });
    }
  }, [antdTheme]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          antdTheme === 'normal' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <div className={classNames([styles.l7Editor, 'l7-editor'])} id="l7-editor">
        <AppHeader />
        <ResizePanel
          onFeatureChange={(e) => {
            if (onFeatureChange) {
              onFeatureChange(e);
            }
          }}
          left={
            <AppMap>
              <MapControlGroup />
              <LayerList />
              <LayerPopup />
            </AppMap>
          }
          right={<MapContent feature={props?.features} />}
        />
      </div>
    </ConfigProvider>
  );
};
