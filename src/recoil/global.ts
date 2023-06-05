import { LocalstorageKey, PrimaryColor } from '@/constants';
import { LarkMapProps } from '@antv/larkmap';
import { useRecoilState } from 'recoil';
import { useDefaultRecoilState } from './atom';

type MapOptions = LarkMapProps['mapOptions'];

export default function useGlobal() {
  const [rightWidth, setRightWidth] = useRecoilState(
    useDefaultRecoilState<number>({
      storageKey: LocalstorageKey.RightPanelWidth,
      storageValue: 50,
      stateKey: 'rightWidth',
    }),
  );

  const [mapOptions, setMapOptions] = useRecoilState(
    useDefaultRecoilState<MapOptions>({
      storageKey: LocalstorageKey.MapOptions,
      storageValue: { style: 'normal', maxZoom: 24 },
      stateKey: 'mapOption',
    }),
  );

  const [layerColor, setLayerColor] = useRecoilState(
    useDefaultRecoilState<string>({
      storageKey: LocalstorageKey.LayerColor,
      storageValue: PrimaryColor,
      stateKey: 'layerColor',
    }),
  );

  const [hideEditor, setHideEditor] = useRecoilState(
    useDefaultRecoilState<boolean>({
      storageKey: LocalstorageKey.HideEditor,
      storageValue: false,
      stateKey: 'hideEdit',
    }),
  );

  const [autoFitBounds, setAutoFitBounds] = useRecoilState(
    useDefaultRecoilState<boolean>({
      storageKey: LocalstorageKey.AutoFitBounds,
      storageValue: true,
      stateKey: 'isAutoFit',
    }),
  );

  const [popupTrigger, setPopupTrigger] = useRecoilState(
    useDefaultRecoilState<'click' | 'hover'>({
      storageKey: LocalstorageKey.PopupTrigger,
      storageValue: 'click',
      stateKey: 'popupTrigger',
    }),
  );

  const [baseMap, setBaseMap] = useRecoilState(
    useDefaultRecoilState<'Gaode' | 'Mapbox'>({
      storageKey: LocalstorageKey.BaseMap,
      storageValue: 'Gaode',
      stateKey: 'baseMap',
    }),
  );

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
  };
}
