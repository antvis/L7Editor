import type { Feature, Geometry, GeometryCollection } from '@turf/turf';
import type { FeatureKey } from '../constants';

/** 筛选器基础类型 */
type FilterBase = {
  id: string;
  field: string;
  params?: Record<string, unknown>;
  logic: 'or' | 'and';
};

/** 文本型筛选器 */
type FilterString = FilterBase & {
  type: 'string';
} & (
    | {
        // 精准匹配
        operator: 'IN' | 'NOT_IN';
        value: string[];
      }
    | {
        // 模糊匹配
        operator: 'LIKE' | 'NOT_LIKE';
        value: string;
      }
  );

/** 数值型筛选器 */
type FilterNumber = FilterBase & {
  type: 'number';
} & (
    | {
        // 大于 | 大于等于 | 等于 | 小于等于 | 小于
        operator: '>' | '>=' | '=' | '<=' | '<';
        value: number;
      }
    | {
        // 在范围内
        operator: 'BETWEEN';
        value: [number, number];
      }
  );

type BaseFilterField = {
  type: number | string;
  field: string;
};

type FilterNumberData = BaseFilterField & {
  min?: number;
  max?: number;
};

type FilterStringData = BaseFilterField & {
  value?: string[];
};

type FilterField = FilterStringData | FilterNumberData;

/** 筛选器子节点，单个筛选条件 */
type FilterNode = FilterString | FilterNumber;

type LngLatImportType = 'Point' | 'LingString' | 'Polygon';

type IFeatures = Feature<
  Geometry | GeometryCollection,
  {
    // @ts-ignore
    [FeatureKey.Index]: number;
  }
>[];

export {
  FilterField,
  FilterNode,
  FilterNumberData,
  FilterStringData,
  IFeatures,
  LngLatImportType,
};
