import { LocalstorageKey, PrimaryColor } from '@/constants';
import { LarkMapProps } from '@antv/larkmap';
import { useLocalStorageState } from 'ahooks';

type MapOptions = LarkMapProps['mapOptions'];

export default () => {
  const [rightWidth, setRightWidth] = useLocalStorageState(
    LocalstorageKey.RightPanelWidth,
    {
      defaultValue: 50,
    },
  );
  const [mapOptions, setMapOptions] = useLocalStorageState<MapOptions>(
    LocalstorageKey.MapOptions,
    {
      defaultValue: {
        style: 'normal',
      },
    },
  );
  const [layerColor, setLayerColor] = useLocalStorageState(
    LocalstorageKey.LayerColor,
    {
      defaultValue: PrimaryColor,
    },
  );
  const [hideEditor, setHideEditor] = useLocalStorageState(
    LocalstorageKey.HideEditor,
    {
      defaultValue: false,
    },
  );
  const [autoFitBounds, setAutoFitBounds] = useLocalStorageState(
    LocalstorageKey.AutoFitBounds,
    {
      defaultValue: true,
    },
  );

  const [popupTrigger, setPopupTrigger] = useLocalStorageState<
    'click' | 'hover'
  >(LocalstorageKey.PopupTrigger, {
    defaultValue: 'click',
  });

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
  };
};
