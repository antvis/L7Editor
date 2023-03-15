import { FilterStringData } from '@/types/filter';
import { Form, Input, Select } from 'antd';
import { uniq } from 'lodash';
import React, { useMemo } from 'react';
import { useModel } from 'umi';

const select = [
  { label: '模糊匹配', value: 'LIKE' },
  { label: '精准匹配', value: 'IN' },
];
interface Props {
  name: number;
  index: number;
}
const StringFilter: React.FC<Props> = ({ name, index }) => {
  const { featureKeyList } = useModel('feature');

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={[name, 'operator']}
        style={{ width: '100px', marginRight: '8px' }}
      >
        <Select placeholder="请选择过滤逻辑" options={select}></Select>
      </Form.Item>
      <Form.Item
        shouldUpdate={(prevValues, curValues) =>
          prevValues.operator !== curValues.operator
        }
        style={{ width: 150, margin: 0 }}
      >
        {({ getFieldsValue }) => {
          const { filterFromList } = getFieldsValue();
          const fieldValue = JSON.parse(filterFromList[index].field)?.field;
          const DataList: FilterStringData | undefined = featureKeyList.find(
            (item) => item?.field === fieldValue,
          );
          if (filterFromList[index].operator === 'LIKE') {
            return (
              <Form.Item name={[name, 'value']}>
                <Input placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
            );
          }
          return (
            <Form.Item name={[name, 'value']}>
              <Select
                placeholder="请输入"
                style={{ width: '100%' }}
                mode="tags"
              >
                {(uniq(DataList?.value) ?? []).map((item) => (
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
