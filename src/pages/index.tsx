import { GlobalOutlined, TableOutlined } from '@ant-design/icons';
import { ConfigProvider, TabsProps, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useEffect, useMemo } from 'react';
import {
  AppHeader,
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '../components';
import { AppEditor } from '../components/app-editor';
import { AppTable } from '../components/app-table';
import { WktEditor } from '../components/wkt-editor';
import { IconFont } from '../constants';
import { useGlobal } from '../recoil';
import { L7EditorProps } from '../types';

export const Editor: React.FC<L7EditorProps> = ({
  onFeatureChange,
  editorConfig,
}) => {
  const { theme: antdTheme, mapOptions, setMapOptions } = useGlobal();
  const items: TabsProps['items'] = [
    {
      key: 'code',
      label: (
        <div>
          <IconFont type="icon-json" />
          GeoJSON
        </div>
      ),
      children: <AppEditor />,
    },
    {
      key: 'wkt',
      label: (
        <div>
          <GlobalOutlined />
          WKT
        </div>
      ),
      children: <WktEditor />,
    },
    {
      key: 'table',
      label: (
        <div id="l7-editor-driver-table">
          <TableOutlined />
          表格
        </div>
      ),
      children: <AppTable />,
    },
  ];
  const newTabItem: TabsProps['items'] = useMemo(() => {
    if (editorConfig?.tabs?.length) {
      return [...items, ...editorConfig.tabs];
    }
    return items;
  }, [editorConfig?.tabs]);

  useEffect(() => {
    if (antdTheme === 'norm') {
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
          antdTheme === 'norm' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <div id="l7-editor-driver">
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
          right={
            <MapContent tabItem={newTabItem} feature={editorConfig?.feature} />
          }
        />
      </div>
    </ConfigProvider>
  );
};
