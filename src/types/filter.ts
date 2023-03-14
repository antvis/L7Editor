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

/** 筛选器子节点，单个筛选条件 */
export type FilterNode = FilterString | FilterNumber;
