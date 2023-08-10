import { useRecoilState } from 'recoil';
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
} from './atomState';

export default function useGlobal() {
  const [rightWidth, setRightWidth] = useRecoilState(rightWidthState);

  const [mapOptions, setMapOptions] = useRecoilState(mapOptionState);

  const [layerColor, setLayerColor] = useRecoilState(layerColorState);

  const [hideEditor, setHideEditor] = useRecoilState(hideEditorState);

  const [autoFitBounds, setAutoFitBounds] = useRecoilState(autoFitBoundsState);

  const [popupTrigger, setPopupTrigger] = useRecoilState(popupTriggerState);

  const [baseMap, setBaseMap] = useRecoilState(baseMapState);

  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  const [layerType, setLayerType] = useRecoilState(layerTypeState);

  const [convert, setConvert] = useRecoilState(convertState);

  const [theme, setTheme] = useRecoilState(themeState);

  return {
    rightWidth,
    setRightWidth,
    mapOptions,
    setMapOptions,
    layerColor,
    setLayerColor,
    hideEditor,
    setHideEditor,
    popupTrigger,
    setPopupTrigger,
    baseMap,
    setBaseMap,
    autoFitBounds,
    setAutoFitBounds,
    activeTab,
    setActiveTab,
    layerType,
    setLayerType,
    convert,
    setConvert,
    theme,
    setTheme,
  };
}
