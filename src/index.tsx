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
import { MutableSnapshot, RecoilEnv, RecoilRoot } from 'recoil';
import {
  baseMapState,
  layerColorState,
  rightWidthState,
  mapOptionState,
  autoFitBoundsState,
  popupTriggerState,
  activeTabState,
  lnglatTypeState
} from '@/recoil/atomState'
import { PrimaryColor } from './constants';
import { L7EditorProps } from './types';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const L7Editor = (props: L7EditorProps) => {
  const { editConfig } = props
  const isPc = useMemo(() => {
    return !/Mobi|Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const initializeState = useMemo(() => {
    return ({ set }: MutableSnapshot) => {
      set(baseMapState, editConfig.baseMap ?? 'Gaode')
      set(layerColorState, editConfig?.primaryColor ?? PrimaryColor)
      set(rightWidthState, editConfig?.rightWidth ?? 40)
      set(mapOptionState, editConfig?.mapOption ?? { style: 'normal', maxZoom: 24 })
      set(autoFitBoundsState, !editConfig?.autoFitBounds)
      set(popupTriggerState, editConfig?.popupTrigger ?? 'click')
      set(activeTabState, editConfig?.activeTab ?? 'code')
      set(lnglatTypeState, editConfig?.lnglatType ?? 'Point')
    }
  }, [editConfig])

  return isPc ? (
    <RecoilRoot initializeState={initializeState}>
      <ConfigProvider locale={zhCN}>
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
      </ConfigProvider>
    </RecoilRoot>
  ) : (
    <Result status="404" title="请用PC端打开" />
  );
};

export * from './components';

export { L7Editor }