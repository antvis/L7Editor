import { ConfigProvider, Empty, Table, TableProps, Typography } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useModel } from 'umi';
import { useSize } from 'ahooks';
import { isNull, isUndefined, uniqBy } from 'lodash';
import zhCN from 'antd/es/locale/zh_CN';
const { Text } = Typography;

const formatTableValue = (value: any) => {
  if (isNull(value) || isUndefined(value)) {
    return '-';
  }
  return value instanceof Object ? (
    JSON.stringify(value)
  ) : (
    <Text style={{ width: 100 }} ellipsis={{ tooltip: String(value) }}>
      {String(value)}
    </Text>
  );
};

export const AppTable = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};
  const { features } = useModel('feature');

  const dataSource = useMemo(() => {
    return features.map((item, index) => {
      const { properties } = item;
      return { __index: index + 1, ...properties };
    });
  }, [features]);

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
        sorter: (a: any, b: any) => a['__index'] - b['__index'],
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
        title: (
          <Text
            style={key.length > 20 ? { width: 170 } : undefined}
            ellipsis={{ tooltip: key }}
          >
            {key}
          </Text>
        ),
        dataIndex: key,
        key: `${key}${index}`,
        align: 'center',
        width: key.length > 20 ? 200 : 100,
        render: formatTableValue,
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
        <ConfigProvider locale={zhCN}>
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: width, y: height - 54 }}
          />
        </ConfigProvider>
      ) : (
        <Empty description="当前数据无字段" style={{ margin: '12px 0' }} />
      )}
    </div>
  );
};
