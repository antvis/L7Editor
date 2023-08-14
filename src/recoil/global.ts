import { useRecoilState } from 'recoil';
import {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  convertState,
  hideEditorState,
  layerColorState,
  officialLayersState,
  mapOptionState,
  popupTriggerState,
  rightWidthState,
  themeState,
} from './atomState';

export default function useGlobal() {
  const [rightPanelWidth, setRightWidth] = useRecoilState(rightWidthState);

  const [mapOptions, setMapOptions] = useRecoilState(mapOptionState);

  const [layerColor, setLayerColor] = useRecoilState(layerColorState);

  const [hideEditor, setHideEditor] = useRecoilState(hideEditorState);

  const [autoFitBounds, setAutoFitBounds] = useRecoilState(autoFitBoundsState);

  const [popupTrigger, setPopupTrigger] = useRecoilState(popupTriggerState);

  const [baseMap, setBaseMap] = useRecoilState(baseMapState);

  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  const [layerType, setLayerType] = useRecoilState(officialLayersState);

  const [coordConvert, setConvert] = useRecoilState(convertState);

  const [theme, setTheme] = useRecoilState(themeState);

  return {
    rightPanelWidth,
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
    coordConvert,
    setConvert,
    theme,
    setTheme,
  };
}
