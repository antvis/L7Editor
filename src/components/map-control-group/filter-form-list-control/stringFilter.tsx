import { FilterStringData } from '@/types/filter';
import { Form, FormInstance, Input, Select } from 'antd';
import { cloneDeep, uniq } from 'lodash';
import React from 'react';
import { useModel } from 'umi';

const select = [
  { label: '包含', value: 'IN' },
  { label: '不包含', value: 'NOT_IN' },
  { label: '匹配', value: 'LIKE' },
  { label: '不匹配', value: 'NOT_LIKE' },
];
interface Props {
  name: number;
  index: number;
  form: FormInstance;
}
const StringFilter: React.FC<Props> = ({ name, index, form }) => {
  const { featureKeyList } = useModel('feature');
  const { setFilter } = useModel('filter');

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={[name, 'operator']}
        style={{ width: '100px', marginRight: '8px' }}
      >
        <Select
          placeholder="请选择过滤逻辑"
          options={select}
          onChange={(value) => {
            const newFilterFromList = cloneDeep(
              form.getFieldValue('filterFromList'),
            );

            newFilterFromList.forEach((v: any, i: number) => {
              if (index === i) {
                v.value = undefined;
              }
            });
            form.setFieldValue('filterFromList', newFilterFromList);
            setFilter(
              newFilterFromList.map((item: any) => {
                const { field, type } = JSON.parse(item.field);
                return { ...item, field, type };
              }),
            );
          }}
        />
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
          const fieldType = filterFromList[index].operator;
          if (fieldType === 'LIKE' || fieldType === 'NOT_LIKE') {
            return (
              <Form.Item name={[name, 'value']}>
                <Input
                  placeholder="请输入筛选值"
                  style={{ width: '100%' }}
                  allowClear
                />
              </Form.Item>
            );
          }
          return (
            <Form.Item name={[name, 'value']}>
              <Select
                placeholder="请选择筛选项"
                style={{ width: '100%' }}
                mode='multiple'
                maxTagCount={1}
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
