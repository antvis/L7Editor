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
        operator: 'IN';
        value: string[];
      }
    | {
        // 模糊匹配
        operator: 'LIKE';
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

/** 布尔型筛选器 */
type FilterBoolean = FilterBase & {
  type: 'boolean';
} & {
  operator: 'true' | 'false';
  value: boolean;
};

/** 日期型筛选器 */
type FilterDate = FilterBase & {
  /** 日期粒度 */
  granularity?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
} & (
    | {
        type: 'date';
        operator: 'between';
        value: [string, string];
      }
    | {
        type: 'date';
        operator: '>' | '<';
        value: string;
      }
  );

type BaseFilterField = {
  type: number | string;
  field: string;
};

export type FilterNumberData = BaseFilterField & {
  min?: number;
  max?: number;
};

export type FilterStringData = BaseFilterField & {
  value?: string[];
};

export type FilterField = FilterStringData | FilterNumberData;

/** 筛选器子节点，单个筛选条件 */
export type FilterNode = FilterString | FilterNumber | FilterBoolean;
