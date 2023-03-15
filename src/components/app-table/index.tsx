import { Empty, Table, TableProps } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useModel } from 'umi';
import { useSize } from 'ahooks';
import { isEmpty, isNull, isUndefined, uniqBy } from 'lodash';
import { useFilterFeature } from '@/hooks/useFilterFeature';

const formatTableValue = (value: any) => {
  if (isNull(value) || isUndefined(value)) {
    return '-';
  }
  return value instanceof Object ? JSON.stringify(value) : String(value);
};

export const AppTable = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};
  const { newFeatures } = useFilterFeature()
  const { filter } = useModel('filter');
  const { features } = useModel('feature');


  const dataSource = useMemo(() => {
    const featureList = isEmpty(filter) ? features : newFeatures
    return featureList.map((item, index) => {
      const { properties } = item;
      return { __index: index + 1, ...properties };
    });
  }, [features, filter, newFeatures]);

  const columns = useMemo(() => {
    const newColumns: TableProps<any>['columns'] = [];
    const featureKeyList = Array.from(
      new Set(
        features
          .map((item) => {
            const { properties } = item;
            return Object.keys(properties);
          })
          .flat(),
      ),
    );

    if (featureKeyList) {
      newColumns.push({
        title: '序号',
        dataIndex: '__index',
        key: `__index`,
        width: 80,
        align: 'center',
        fixed: 'left',
        sorter: (a: any, b: any) => a.index - b.index,
      });
    }

    featureKeyList.forEach((key, index) => {
      const options = uniqBy(
        dataSource
          .map((item: any) => item[key])
          .map((value: any) => {
            return {
              text: formatTableValue(value),
              value: value,
            };
          }),
        'text',
      );
      newColumns.push({
        title: key,
        dataIndex: key,
        key: `${key}${index}`,
        align: 'center',
        render: formatTableValue,
        width: 80,
        filters: options.length ? options : undefined,
        onFilter: (value: any, record: any) => {
          return (record[key] ?? '') === value;
        },
        filterSearch: true,
        sorter: !options.length
          ? (a: any, b: any) => {
            return (
              (typeof a[key] === 'string' || !a[key] ? 0 : a[key]) -
              (typeof b[key] === 'string' || !b[key] ? 0 : b[key])
            );
          }
          : undefined,
      });
    });
    return newColumns;
  }, [features, dataSource]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={container}>
      {columns?.length ? (
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: width, y: height - 54 }}
        />
      ) : (
        <Empty description="当前数据无字段" style={{ margin: '12px 0' }} />
      )}
    </div>
  );
};
