import { LocalstorageKey, PrimaryColor } from '@/constants';
import { IFeature, LngLatImportType } from '@/types';
import { FilterNode } from '@/types/filter';
import { Scene } from '@antv/l7';
import { LarkMapProps } from '@antv/larkmap';
import { atom, DefaultValue } from 'recoil';

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const getValue = localStorage.getItem(key);
    if (getValue) {
      setSelf(JSON.parse(getValue));
    }
    onSet((newValue: Record<string, any>) => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

const filterState = atom<FilterNode[]>({
  key: 'filter',
  default: [],
  dangerouslyAllowMutability: true,
});

const isDrawState = atom<boolean>({
  key: 'isDraw',
  default: false,
});

const savedTextState = atom<string>({
  key: 'savedText',
  default: '',
});

const featureState = atom<IFeature>({
  key: 'features',
  default: [],
  dangerouslyAllowMutability: true,
});

const sceneState = atom<Scene | null>({
  key: 'scene',
  default: null,
  dangerouslyAllowMutability: true,
});

const editorTextState = atom<string>({
  key: 'editorText',
  default: JSON.stringify({ type: 'FeatureCollection', features: [] }, null, 2),
  effects: [localStorageEffect(LocalstorageKey.EditorText)],
});

const lnglatTypeState = atom<LngLatImportType>({
  key: 'lnglatType',
  default: 'Point',
});

const lnglatTextState = atom({
  key: 'lnglatText',
  default: '',
});

const rightWidthState = atom<number>({
  key: 'rightWidth',
  default: 40,
  effects: [localStorageEffect(LocalstorageKey.RightPanelWidth)],
});

const mapOptionState = atom<LarkMapProps['mapOptions']>({
  key: 'mapOptions',
  default: { style: 'normal', maxZoom: 24 },
  effects: [localStorageEffect(LocalstorageKey.MapOptions)],
});

const layerColorState = atom<string>({
  key: 'layerColor',
  default: PrimaryColor,
  effects: [localStorageEffect(LocalstorageKey.LayerColor)],
});

const hideEditorState = atom<boolean>({
  key: 'hideEditor',
  default: false,
  effects: [localStorageEffect(LocalstorageKey.HideEditor)],
});

const autoFitBoundsState = atom<boolean>({
  key: 'autoFitBounds',
  default: true,
  effects: [localStorageEffect(LocalstorageKey.AutoFitBounds)],
});

const popupTriggerState = atom<'click' | 'hover'>({
  key: 'popupTrigger',
  default: 'click',
  effects: [localStorageEffect(LocalstorageKey.PopupTrigger)],
});

const baseMapState = atom<'Gaode' | 'Mapbox'>({
  key: 'baseMap',
  default: 'Gaode',
  effects: [localStorageEffect(LocalstorageKey.BaseMap)],
});

const activeTabState = atom<'code' | 'table'>({
  key: 'activeTab',
  default: 'code',
  effects: [localStorageEffect(LocalstorageKey.ActiveRightTabKey)],
});

export {
  featureState,
  filterState,
  savedTextState,
  sceneState,
  editorTextState,
  layerColorState,
  lnglatTextState,
  lnglatTypeState,
  rightWidthState,
  mapOptionState,
  activeTabState,
  autoFitBoundsState,
  hideEditorState,
  popupTriggerState,
  baseMapState,
  isDrawState,
};
