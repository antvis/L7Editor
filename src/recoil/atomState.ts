import type { Scene } from '@antv/l7';
import type { LarkMapProps } from '@antv/larkmap';
import localforage from 'localforage';
import { atom, DefaultValue } from 'recoil';
import { LocalStorageKey } from '../constants';
import type { IFeatures, LngLatImportType } from '../types';
import type { FilterNode } from '../types/filter';

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

const indexDBEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    localforage.getItem(key).then(function (getValue: any) {
      if (getValue) {
        setSelf(getValue);
      }
    });
    onSet((newValue: Record<string, any>) => {
      if (newValue instanceof DefaultValue) {
        localforage.removeItem(key);
      } else {
        localforage.setItem(key, newValue);
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

const featureState = atom<IFeatures>({
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
  effects: [indexDBEffect(LocalStorageKey.EditorText)],
});

const lnglatTypeState = atom<LngLatImportType>({
  key: 'lnglatType',
});

const lnglatTextState = atom({
  key: 'lnglatText',
  default: '',
});

const rightWidthState = atom<number>({
  key: 'rightPanelWidth',
  effects: [localStorageEffect(LocalStorageKey.RightPanelWidth)],
});

const mapOptionState = atom<LarkMapProps['mapOptions']>({
  key: 'mapOptions',
  effects: [localStorageEffect(LocalStorageKey.MapOptions)],
});

const layerColorState = atom<string>({
  key: 'layerColor',
  effects: [localStorageEffect(LocalStorageKey.LayerColor)],
});

const hideEditorState = atom<boolean>({
  key: 'hideEditor',
  default: false,
  effects: [localStorageEffect(LocalStorageKey.HideEditor)],
});

const autoFitBoundsState = atom<boolean>({
  key: 'autoFitBounds',
  effects: [localStorageEffect(LocalStorageKey.AutoFitBounds)],
});

const popupTriggerState = atom<'click' | 'hover'>({
  key: 'popupTrigger',
  effects: [localStorageEffect(LocalStorageKey.PopupTrigger)],
});

const baseMapState = atom<'Gaode' | 'Mapbox'>({
  key: 'baseMap',
  effects: [localStorageEffect(LocalStorageKey.BaseMap)],
});

const activeTabState = atom<'geojson' | 'table' | 'wkt' | string>({
  key: 'activeTab',
  default: 'geojson',
  effects: [localStorageEffect(LocalStorageKey.ActiveRightTabKey)],
});

const officialLayersState = atom<string[]>({
  key: 'layerType',
  default: [],
  effects: [localStorageEffect(LocalStorageKey.officialLayers)],
});

const convertState = atom<string>({
  key: 'coordConvert',
  default: 'GCJ02',
  effects: [localStorageEffect(LocalStorageKey.Convert)],
});

const themeState = atom<string>({
  key: 'theme',
  default: 'light',
  effects: [localStorageEffect(LocalStorageKey.theme)],
});

const cityHistoryState = atom<{ value: string; label: string }[]>({
  key: 'cityHistory',
  default: [],
  effects: [localStorageEffect(LocalStorageKey.cityHistory)],
});

const showIndexState = atom<boolean>({
  key: 'showIndex',
  default: true,
  effects: [localStorageEffect(LocalStorageKey.showIndex)],
});

const localeState = atom<string>({
  key: 'locale',
  default: 'zh-CN',
  effects: [localStorageEffect(LocalStorageKey.locale)],
});

export {
  activeTabState,
  autoFitBoundsState,
  baseMapState,
  cityHistoryState,
  convertState,
  editorTextState,
  featureState,
  filterState,
  hideEditorState,
  isDrawState,
  layerColorState,
  lnglatTextState,
  lnglatTypeState,
  localeState,
  mapOptionState,
  officialLayersState,
  popupTriggerState,
  rightWidthState,
  savedTextState,
  sceneState,
  showIndexState,
  themeState,
};
