import { Result } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MutableSnapshot } from 'recoil';
import { RecoilEnv, RecoilRoot } from 'recoil';
import { PrimaryColor } from '../constants';
import '../constants/iconfont.js';
import '../locales/index';
import {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  convertState,
  customTilesState,
  hideEditorState,
  layerColorState,
  localeState,
  mapOptionState,
  officialLayersState,
  popupTriggerState,
  rightWidthState,
  showDrawAreaState,
  showDrawDistanceState,
  showTextLayerState,
  textLayerFieldsState,
  themeState,
  wasmPathState,
} from '../recoil/atomState';
import type { L7EditorProps } from '../types';
import { Editor } from './components/editor';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const L7Editor = (props: L7EditorProps) => {
  const { t } = useTranslation();
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
      set(themeState, props?.theme ?? 'light');
      set(convertState, props?.coordConvert ?? 'GCJ02');
      set(localeState, props?.locale ?? 'zh-CN');
      set(wasmPathState, props?.wasmPath ?? '/');
      set(showTextLayerState, props?.showTextLayer ?? false);
      set(textLayerFieldsState, props?.textLayerFields ?? undefined);
      set(showDrawDistanceState, props.showDrawDistance ?? false);
      set(showDrawAreaState, props.showDrawArea ?? false);
      set(customTilesState, props.customTiles ?? []);
    };
  }, [props]);

  return isPc ? (
    <RecoilRoot initializeState={initializeState}>
      <Editor {...props} />
    </RecoilRoot>
  ) : (
    <Result status="404" title={t('pages.index.qingYongPCDuan')} />
  );
};
