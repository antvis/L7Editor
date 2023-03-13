import { Empty, Table } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

export const Tables = () => {
  const { features } = useModel('feature');

  const dataSource = useMemo(() => {
    const Datalist = features.map((item, index) => {
      const { properties } = item;
      return { index: index + 1, ...properties };
    });
    return Datalist;
  }, [features]);

  const columns: any = useMemo(() => {
    const Datalist = features.map((item) => {
      const { properties } = item;
      return Object.keys(properties);
    });
    const newDataList = Array.from(new Set(Datalist.flat(Infinity)));
    const newData = [
      {
        title: 'index',
        dataIndex: 'index',
        key: `index`,
        width: 40,
        align: 'center',
        fixed: 'left',
        sorter: (a, b) => a.index - b.index,
      },
    ];
    const data = newDataList.map((item: any, index) => {
      const a = dataSource
        .map((v) => {
          if (
            (v[item] && typeof v[item] === 'string') ||
            (v[item] && typeof v[item] === 'boolean')
          ) {
            return {
              text: `${v[item]}`,
              value: v[item],
            };
          }
        })
        .filter((item) => {
          return item;
        });
      return {
        title: item,
        dataIndex: item,
        key: `${item}${index}`,
        align: 'center',
        render: (text) =>
          text ? (typeof text === 'boolean' ? `${text}` : text) : '-',
        width: 80,
        filters: a.length ? a : undefined,
        onFilter: (value: string, record) => {
          return (record[item] ?? '') === value;
        },
        filterSearch: true,
        sorter: !a.length
          ? (a, b) => {
              return (
                (typeof a[item] === 'string' || !a[item] ? 0 : a[item]) -
                (typeof b[item] === 'string' || !b[item] ? 0 : b[item])
              );
            }
          : undefined,
      };
    });
    if (data.length) {
      return [...newData, ...data];
    }
    return [];
  }, [features, dataSource]);

  return (
    <div>
      {columns.length ? (
        <Table
          style={{ width: '99%' }}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: columns.length > 6 ? 1500 : '100%' }}
        />
      ) : (
        <Empty description="当前数据无字段" style={{ margin: '12px 0' }} />
      )}
    </div>
  );
};
