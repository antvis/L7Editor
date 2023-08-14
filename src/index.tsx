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
  const isPc = useMemo(() => {
    return !/Mobi|Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const initializeState = useMemo(() => {
    return ({ set }: MutableSnapshot) => {
      set(baseMapState, props?.baseMap ?? 'Gaode');
      set(layerColorState, props?.primaryColor ?? PrimaryColor);
      set(rightWidthState, props?.rightPanelWidth ?? 40);
      set(mapOptionState, props?.mapOption ?? { style: 'normal', maxZoom: 24 });
      set(autoFitBoundsState, !props?.autoFitBounds);
      set(popupTriggerState, props?.popupTrigger ?? 'click');
      set(activeTabState, props?.activeTab ?? 'geojson');
      set(layerTypeState, props?.officialLayers ?? []);
      set(hideEditorState, props?.hidePanel ?? false);
      set(themeState, props?.theme ?? 'normal');
      set(convertState, props?.coordConvert ?? 'GCJ02');
    };
  }, [props]);

  return isPc ? (
    <RecoilRoot initializeState={initializeState}>
      <Editor props={props} />
    </RecoilRoot>
  ) : (
    <Result status="404" title="请用PC端打开" />
  );
};

export * from './components';
export * from './types';
export { L7Editor };
