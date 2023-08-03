import {
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from './components';
import {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  hideEditorState,
  layerColorState,
  layerTypeState,
  lnglatTypeState,
  mapOptionState,
  popupTriggerState,
  rightWidthState,
} from './recoil/atomState';
import { CodeOutlined, TableOutlined } from '@ant-design/icons';
import { ConfigProvider, Result, TabsProps } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useMemo } from 'react';
import { MutableSnapshot, RecoilEnv, RecoilRoot } from 'recoil';
import { AppHeader } from './components';
import { AppEditor } from './components/app-editor';
import { AppTable } from './components/app-table';
import { PrimaryColor } from './constants';
import { L7EditorProps } from './types';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const L7Editor = (props: L7EditorProps) => {
  const { editorConfig, onFeatureChange } = props;
  const isPc = useMemo(() => {
    return !/Mobi|Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const initializeState = useMemo(() => {
    return ({ set }: MutableSnapshot) => {
      set(baseMapState, editorConfig.baseMap ?? 'Gaode');
      set(layerColorState, editorConfig?.primaryColor ?? PrimaryColor);
      set(rightWidthState, editorConfig?.rightWidth ?? 40);
      set(
        mapOptionState,
        editorConfig?.mapOption ?? { style: 'normal', maxZoom: 24 },
      );
      set(autoFitBoundsState, !editorConfig?.autoFitBounds);
      set(popupTriggerState, editorConfig?.popupTrigger ?? 'click');
      set(activeTabState, editorConfig?.activeTab ?? 'code');
      set(lnglatTypeState, editorConfig?.lnglatType ?? 'Point');
      set(layerTypeState, editorConfig?.layerType ?? []);
      set(hideEditorState, editorConfig?.hidePanel ?? false);
    };
  }, [editorConfig]);

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
        <div>
          <TableOutlined style={{ marginLeft: 5 }} />
          表格
        </div>
      ),
      children: <AppTable />,
    },
  ];

  const newTabItem: TabsProps['items'] = useMemo(() => {
    if (editorConfig.tabs?.length) {
      return [...items, ...editorConfig.tabs];
    }
    return items;
  }, [editorConfig.tabs]);

  return isPc ? (
    <RecoilRoot initializeState={initializeState}>
      <ConfigProvider locale={zhCN}>
        <div>
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
              <MapContent tabItem={newTabItem} feature={editorConfig.feature} />
            }
          />
        </div>
      </ConfigProvider>
    </RecoilRoot>
  ) : (
    <Result status="404" title="请用PC端打开" />
  );
};

export * from './components';
export * from './types';
export { L7Editor };
