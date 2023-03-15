import {
  CloseOutlined,
  FieldBinaryOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import { Button, Form, Select } from 'antd';
import { cloneDeep, flatMap, isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { useModel } from 'umi';
import BooleanFilter from './booleanFilter';
import NumberFilter from './numberFilter';
import StringFilter from './stringFilter';
const { Option } = Select;
const FilterFormListControl: React.FC = () => {
  const { featureKeyList } = useModel('feature');
  const { setFilter, filter } = useModel('filter');
  const [form] = Form.useForm();

  const onValuesChange = (_: any, all: any) => {
    if (isEmpty(all.filterFromList)) {
      setFilter([]);
      return;
    }
    const newValue = all.filterFromList
      .filter((item: any) => item)
      .map((item: any) => {
        if (item.field) {
          const { field, type } = JSON.parse(item.field || '');
          if (item.operator === 'BETWEEN') {
            if (item.min && item.max) {
              return {
                ...item,
                field,
                type,
                value: [item.min, item.max],
              };
            }
          }
          return { ...item, field, type };
        } else {
          return { ...item, field: undefined, type: undefined };
        }
      });
    setFilter(newValue);
  };

  return (
    <CustomControl
      position="topright"
      style={{ display: 'flex', background: '#fff', padding: '16px' }}
    >
      <div style={{ width: '500px' }}>
        <Form form={form} onValuesChange={onValuesChange}>
          <Form.List name="filterFromList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <div key={index.toString()} style={{ display: 'flex' }}>
                    <Form.Item name={[name, 'logic']} initialValue="and">
                      <Select style={{ width: 70, marginRight: '8px' }}>
                        <Option value="and">并且</Option>
                        <Option value="or">或者</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={[name, 'field']}
                      initialValue={JSON.stringify({
                        field: featureKeyList[0].field,
                        type: featureKeyList[0].type,
                      })}
                    >
                      <Select
                        style={{ width: 130, marginRight: '8px' }}
                        placeholder="请选择字段"
                        onChange={() => {
                          const newFilterFromList = cloneDeep(
                            form.getFieldValue('filterFromList'),
                          );
                          newFilterFromList.forEach((v: any, i: number) => {
                            if (index === i) {
                              v.operator = undefined;
                              v.value = undefined;
                            }
                          });
                          form.setFieldValue(
                            'filterFromList',
                            newFilterFromList,
                          );
                          setFilter(
                            newFilterFromList.map((item: any) => {
                              const { field, type } = JSON.parse(item.field);
                              return { ...item, field, type };
                            }),
                          );
                        }}
                      >
                        {featureKeyList.map(({ field, type }) => {
                          return (
                            <Option value={JSON.stringify({ field, type })}>
                              <i
                                style={{
                                  fontSize: 20,
                                  marginRight: 8,
                                  color: '#999',
                                }}
                              >
                                {type === 'number' ? (
                                  <FieldBinaryOutlined />
                                ) : (
                                  <FieldStringOutlined />
                                )}
                              </i>
                              {field}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.field === curValues.field
                      }
                      style={{ margin: 0 }}
                    >
                      {({ getFieldsValue }) => {
                        const { filterFromList } = getFieldsValue();
                        if (filterFromList[index].field) {
                          const { type } = JSON.parse(
                            filterFromList[index].field,
                          );
                          if (type === 'number') {
                            return <NumberFilter name={name} index={index} />;
                          }
                          if (type === 'boolean') {
                            return <BooleanFilter name={name} />;
                          }
                          return <StringFilter name={name} index={index} />;
                        }
                      }}
                    </Form.Item>
                    <Button
                      type="text"
                      onClick={() => remove(name)}
                      icon={<CloseOutlined />}
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  添加筛选条件
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </CustomControl>
  );
};

export default FilterFormListControl;
