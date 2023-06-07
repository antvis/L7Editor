import { LocalStorageKey, PrimaryColor } from '@/constants';
import { LarkMapProps } from '@antv/larkmap';
import { useLocalStorageState } from 'ahooks';

type MapOptions = LarkMapProps['mapOptions'];

export default () => {
  const [rightWidth, setRightWidth] = useLocalStorageState(
    LocalStorageKey.RightPanelWidth,
    {
      defaultValue: 50,
    },
  );
  const [mapOptions, setMapOptions] = useLocalStorageState<MapOptions>(
    LocalStorageKey.MapOptions,
    {
      defaultValue: {
        style: 'normal',
        maxZoom: 24,
      },
    },
  );
  const [layerColor, setLayerColor] = useLocalStorageState(
    LocalStorageKey.LayerColor,
    {
      defaultValue: PrimaryColor,
    },
  );
  const [hideEditor, setHideEditor] = useLocalStorageState(
    LocalStorageKey.HideEditor,
    {
      defaultValue: false,
    },
  );
  const [autoFitBounds, setAutoFitBounds] = useLocalStorageState(
    LocalStorageKey.AutoFitBounds,
    {
      defaultValue: true,
    },
  );

  const [popupTrigger, setPopupTrigger] = useLocalStorageState<
    'click' | 'hover'
  >(LocalStorageKey.PopupTrigger, {
    defaultValue: 'click',
  });

  const [baseMap, setBaseMap] = useLocalStorageState<'Gaode' | 'Mapbox'>(
    LocalStorageKey.BaseMap,
    {
      defaultValue: 'Gaode',
    },
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
    autoFitBounds,
    setAutoFitBounds,
    baseMap,
    setBaseMap,
  };
};
