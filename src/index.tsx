import { Result } from 'antd';
import React, { useMemo } from 'react';
import { MutableSnapshot, RecoilEnv, RecoilRoot } from 'recoil';
import { PrimaryColor } from './constants';
import { Editor } from './pages';
import {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  convertState,
  hideEditorState,
  layerColorState,
  layerTypeState,
  mapOptionState,
  popupTriggerState,
  rightWidthState,
  themeState,
} from './recoil/atomState';
import { L7EditorProps } from './types';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const L7Editor = (props: L7EditorProps) => {
  const { editorConfig, onFeatureChange } = props;

  const isPc = useMemo(() => {
    return !/Mobi|Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const initializeState = useMemo(() => {
    return ({ set }: MutableSnapshot) => {
      set(baseMapState, editorConfig?.baseMap ?? 'Gaode');
      set(layerColorState, editorConfig?.primaryColor ?? PrimaryColor);
      set(rightWidthState, editorConfig?.rightPanelWidth ?? 40);
      set(
        mapOptionState,
        editorConfig?.mapOption ?? { style: 'normal', maxZoom: 24 },
      );
      set(autoFitBoundsState, !editorConfig?.autoFitBounds);
      set(popupTriggerState, editorConfig?.popupTrigger ?? 'click');
      set(activeTabState, editorConfig?.activeTab ?? 'geojson');
      set(layerTypeState, editorConfig?.LayerTypes ?? []);
      set(hideEditorState, editorConfig?.hidePanel ?? false);
      set(themeState, editorConfig?.theme ?? 'officialLayers');
      set(convertState, editorConfig?.coordConvert ?? 'undefined');
    };
  }, [editorConfig]);

  return isPc ? (
    <RecoilRoot initializeState={initializeState}>
      <Editor editorConfig={editorConfig} onFeatureChange={onFeatureChange} />
    </RecoilRoot>
  ) : (
    <Result status="404" title="请用PC端打开" />
  );
};

export * from './components';
export * from './types';
export { L7Editor };
