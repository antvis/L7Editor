import {
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '@/components';
import {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  editorTextState,
  hideEditorState,
  layerColorState,
  layerTypeState,
  lnglatTypeState,
  mapOptionState,
  popupTriggerState,
  rightWidthState,
} from '@/recoil/atomState';
import { ConfigProvider, Result } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useMemo } from 'react';
import { MutableSnapshot, RecoilEnv, RecoilRoot } from 'recoil';
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
      set(
        editorTextState,
        JSON.stringify(editorConfig?.feature, null, 2) ??
          JSON.stringify({ type: 'FeatureCollection', features: [] }, null, 2),
      );
      set(layerTypeState, editorConfig?.layerType ?? []);
      set(hideEditorState, editorConfig?.hidePanel ?? false);
    };
  }, [editorConfig]);

  return isPc ? (
    <RecoilRoot initializeState={initializeState}>
      <ConfigProvider locale={zhCN}>
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
          right={<MapContent />}
        />
      </ConfigProvider>
    </RecoilRoot>
  ) : (
    <Result status="404" title="请用PC端打开" />
  );
};

export * from './components';
export * from './types';
export { L7Editor };
