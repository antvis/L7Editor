import { Form, InputNumber, Select } from 'antd';
import React from 'react';

const select = [
  { label: '>', value: '大于' },
  { label: '>=', value: '大于等于' },
  { label: '=', value: '等于' },
  { label: '<=', value: '小于等于' },
  { label: '<', value: '小于' },
  { label: '区间', value: '区间' },
];
interface Props {
  name: number;
  index: number;
}
const NumberFilter: React.FC<Props> = ({ name, index }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={[name, 'operator']}
        style={{ flex: '1.2', marginRight: '8px' }}
      >
        <Select placeholder="请选择过滤逻辑" options={select} />
      </Form.Item>
      <Form.Item
        style={{ flex: '1.2' }}
        shouldUpdate={(prevValues, curValues) =>
          prevValues.operator === curValues.operator
        }
      >
        {({ getFieldsValue }) => {
          const { filterFromList } = getFieldsValue();
          if (filterFromList[index].operator === '区间') {
            return (
              <Form.Item name={[name, 'value']}>
                <InputNumber
                  style={{ width: '43%' }}
                  placeholder="请输入筛选值"
                />
                <span> - </span>
                <InputNumber
                  style={{ width: '43%' }}
                  placeholder="请输入筛选值"
                />
              </Form.Item>
            );
          }
          return (
            <Form.Item name={[name, 'value']}>
              <InputNumber
                placeholder="请输入筛选值"
                style={{ width: '100%' }}
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default NumberFilter;
