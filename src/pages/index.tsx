import { Result } from 'antd';
import React, { useMemo } from 'react';
import { MutableSnapshot, RecoilEnv, RecoilRoot } from 'recoil';
import { PrimaryColor } from '../constants';
import i18n from '../locales';
import {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  convertState,
  hideEditorState,
  layerColorState,
  mapOptionState,
  officialLayersState,
  popupTriggerState,
  rightWidthState,
  themeState,
} from '../recoil/atomState';
import type { L7EditorProps } from '../types';
import { Editor } from './components/editor';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const L7Editor = (props: L7EditorProps) => {
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
      set(officialLayersState, props?.officialLayers ?? []);
      set(hideEditorState, props?.hidePanel ?? false);
      set(themeState, props?.theme ?? 'normal');
      set(convertState, props?.coordConvert ?? 'GCJ02');
    };
  }, [props]);

  return isPc ? (
    <RecoilRoot initializeState={initializeState}>
      <Editor {...props} />
    </RecoilRoot>
  ) : (
    <Result status="404" title="请用PC端打开" />
  );
};
