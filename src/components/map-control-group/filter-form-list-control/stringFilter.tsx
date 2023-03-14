import { Form, Input, Select } from 'antd';
import React, { useMemo } from 'react';
import { useModel } from 'umi';

const select = [
  { label: '模糊匹配', value: 'IN' },
  { label: '精准匹配', value: 'LIKE' },
];
interface Props {
  name: number;
  index: number;
}
const StringFilter: React.FC<Props> = ({ name, index }) => {
  const { features } = useModel('feature');

  const dataSource = useMemo(() => {
    return features.map((item, index) => {
      const { properties } = item;
      return { __index: index + 1, ...properties };
    });
  }, [features]);

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={[name, 'operator']}
        style={{ flex: '1.2', marginRight: '8px' }}
      >
        <Select placeholder="请选择过滤逻辑" options={select}></Select>
      </Form.Item>
      <Form.Item
        shouldUpdate={(prevValues, curValues) =>
          prevValues.operator !== curValues.operator
        }
        style={{ flex: '1.2' }}
      >
        {({ getFieldsValue }) => {
          const { filterFromList } = getFieldsValue();
          const fieldValue = JSON.parse(filterFromList[index].field)?.value;
          const DataList = dataSource.map((item: any) => item[fieldValue]);
          if (filterFromList[index].operator === 'IN') {
            return (
              <Form.Item name={[name, 'value']}>
                <Input placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
            );
          }
          return (
            <Form.Item name={[name, 'value']}>
              <Select placeholder="请输入" style={{ width: '100%' }} mode='tags'>
                {DataList.map((item) => (
                  <Select.Option value={item}>{item}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default StringFilter;
