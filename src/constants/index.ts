export const RightPanelWidthRange = [20, 80];

export enum LocalstorageKey {
  RightPanelWidth = 'RightPanelWidth',
  MapOptions = 'MapOptions',
  LayerColor = 'LayerColor',
  HideEditor = 'HideEditor',
  EditorText = 'EditorText',
  popupTrigger = 'popupTrigger',
  activeRightTabKey = 'activeRightTabKey',
}

export enum LayerId {
  PointLayer = 'PointLayer',
  LineLayer = 'LineLayer',
  PolygonLayer = 'PolygonLayer',
}

export * from './variable-type';
export const dingGroupImg =
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*d7TMQpSiofwAAAAAAAAAAAAADmJ7AQ/original';

export const PrimaryColor = '#1677ff';

export const FeatureKey = {
  Index: Symbol('index'),
  DrawType: Symbol('drawType'),
  IsEdit: Symbol('isEdit'),
};
