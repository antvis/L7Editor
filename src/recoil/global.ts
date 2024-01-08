import { useRecoilState } from 'recoil';
import {
  activeTabState,
  areaDisplayState,
  autoFitBoundsState,
  baseMapState,
  cityHistoryState,
  convertState,
  customTilesState,
  showDrawDistanceState,
  hideEditorState,
  layerColorState,
  localeState,
  mapOptionState,
  officialLayersState,
  popupTriggerState,
  rightWidthState,
  showTextLayerState,
  textLayerFieldsState,
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

  const [showTextLayer, setShowTextLayer] = useRecoilState(showTextLayerState);

  const [textLayerFields, setTextLayerFields] =
    useRecoilState(textLayerFieldsState);

  const [customTiles, setCustomTiles] = useRecoilState(customTilesState);

  const [locale, setLocale] = useRecoilState(localeState);

  const [wasmPath, setWasmPath] = useRecoilState(wasmPathState);

  const [showDrawDistance, setShowDrawDistance] =
    useRecoilState(showDrawDistanceState);

  const [showDrawArea, setShowDrawArea] = useRecoilState(areaDisplayState);

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
    showTextLayer,
    setShowTextLayer,
    textLayerFields,
    setTextLayerFields,
    customTiles,
    setCustomTiles,
    locale,
    setLocale,
    wasmPath,
    setWasmPath,
    showDrawDistance,
    setShowDrawDistance,
    showDrawArea,
    setShowDrawArea,
  };
}
