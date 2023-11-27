import { useRecoilState } from 'recoil';
import {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  cityHistoryState,
  convertState,
  customTilesState,
  hideEditorState,
  layerColorState,
  localeState,
  mapOptionState,
  officialLayersState,
  popupTriggerState,
  rightWidthState,
  showIndexState,
  themeState,
  wasmPathState,
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

  const [coordConvert, setCoordConvert] = useRecoilState(convertState);

  const [theme, setTheme] = useRecoilState(themeState);

  const [cityHistory, setCityHistory] = useRecoilState(cityHistoryState);

  const [showIndex, setShowIndex] = useRecoilState(showIndexState);

  const [customTiles, setCustomTiles] = useRecoilState(customTilesState);

  const [locale, setLocale] = useRecoilState(localeState);

  const [wasmPath, setWasmPath] = useRecoilState(wasmPathState);

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
    setCoordConvert,
    theme,
    setTheme,
    cityHistory,
    setCityHistory,
    showIndex,
    setShowIndex,
    customTiles,
    setCustomTiles,
    locale,
    setLocale,
    wasmPath,
    setWasmPath,
  };
}
