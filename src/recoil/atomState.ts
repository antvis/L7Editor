import { Scene } from '@antv/l7';
import { LarkMapProps } from '@antv/larkmap';
import { atom, DefaultValue } from 'recoil';
import { IFeature, LngLatImportType } from '..//types';
import { FilterNode } from '..//types/filter';
import { LocalStorageKey } from '../constants';

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
  effects: [localStorageEffect(LocalStorageKey.EditorText)],
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

const activeTabState = atom<'geojson' | 'table' | 'wkt'>({
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
  default: 'normal',
  effects: [localStorageEffect(LocalStorageKey.theme)],
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
  officialLayersState,
  convertState,
  themeState,
};
