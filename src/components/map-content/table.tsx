import { Empty, Table } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

export const Tables = () => {
  const { features } = useModel('feature');

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
      },
    ];
    const data = newDataList.map((item, index) => {
      return {
        title: item,
        dataIndex: item,
        key: `${item}${index}`,
        align: 'center',
        render: (text) => (text ? text : '-'),
        width: 80,
      };
    });
    if (data.length) {
      return [...newData, ...data];
    }
    return [];
  }, [features]);

  const dataSource = useMemo(() => {
    const Datalist = features.map((item, index) => {
      const { properties } = item;
      return { index: index + 1, ...properties };
    });
    return Datalist;
  }, [features]);

  return (
    <div>
      {columns.length ? (
        <Table
          style={{ width: '99%', padding: 10 }}
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
