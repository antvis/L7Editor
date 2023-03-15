import { FilterNumberData } from '@/types/filter';
import { Form, InputNumber, Select, Space } from 'antd';
import React from 'react';
import { useModel } from 'umi';

const select = [
  { label: '>', value: '>' },
  { label: '>=', value: '>=' },
  { label: '=', value: '=' },
  { label: '<=', value: '<=' },
  { label: '<', value: '<' },
  { label: '区间', value: 'BETWEEN' },
];
interface Props {
  name: number;
  index: number;
}
const NumberFilter: React.FC<Props> = ({ name, index }) => {
  const { featureKeyList } = useModel('feature');
  return (
    <div style={{ display: 'flex' }}>
      <Form.Item name={[name, 'operator']}>
        <Select
          style={{ width: '100px', marginRight: '8px' }}
          placeholder="请选择过滤逻辑"
          options={select}
        />
      </Form.Item>
      <Form.Item
        style={{ width: 150, marginBottom: 0 }}
        shouldUpdate={(prevValues, curValues) =>
          prevValues.operator === curValues.operator
        }
      >
        {({ getFieldsValue }) => {
          const { filterFromList } = getFieldsValue();
          const fieldValue = JSON.parse(filterFromList[index].field)?.field;
          const DataList: FilterNumberData | undefined = featureKeyList.find(
            (item) => item?.field === fieldValue,
          );
          if (filterFromList[index].operator === 'BETWEEN') {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item name={[name, 'min']} style={{ width: '70px' }}>
                  <InputNumber
                    placeholder="请输入筛选值"
                    style={{ width: '100%' }}
                    min={DataList?.min ?? 0}
                    max={DataList?.max ?? 0}
                  />
                </Form.Item>
                <span> - </span>
                <Form.Item name={[name, 'max']} style={{ width: '70px' }}>
                  <InputNumber
                    placeholder="请输入筛选值"
                    style={{ width: '100%' }}
                    min={DataList?.min ?? 0}
                    max={DataList?.max ?? 0}
                  />
                </Form.Item>
              </div>
            );
          }
          return (
            <Form.Item name={[name, 'value']}>
              <InputNumber
                placeholder="请输入筛选值"
                style={{ width: '100%' }}
                min={DataList?.min ?? 0}
                max={DataList?.max ?? 0}
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default NumberFilter;
