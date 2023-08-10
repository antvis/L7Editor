import { CodeOutlined, TableOutlined } from '@ant-design/icons';
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
import { useGlobal } from '../recoil';
import { L7EditorProps } from '../types';

export const Editor: React.FC<L7EditorProps> = ({
  onFeatureChange,
  editorConfig,
}) => {
  const { theme: antdTheme, setMapOptions } = useGlobal();
  const items: TabsProps['items'] = [
    {
      key: 'code',
      label: (
        <div>
          <CodeOutlined style={{ marginLeft: 5 }} />
          编辑器
        </div>
      ),
      children: <AppEditor />,
    },
    {
      key: 'table',
      label: (
        <div id="l7-editor-driver-table">
          <TableOutlined style={{ marginLeft: 5 }} />
          表格
        </div>
      ),
      children: <AppTable />,
    },
    {
      key: 'wkt',
      label: <div>wkt编辑器</div>,
      children: <WktEditor />,
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
      setMapOptions({ style: 'normal', maxZoom: 24 });
    } else {
      setMapOptions({ style: 'dark', maxZoom: 24 });
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
