import {
  CloseOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import { Button, Form, Select } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useMemo } from 'react';
import { useModel } from 'umi';
import BooleanFilter from './booleanFilter';
import NumberFilter from './numberFilter';
import StringFilter from './stringFilter';
const { Option } = Select;
const typeColor: Record<string, string> = {
  string: 'green',
  boolean: 'blue',
  number: 'red',
};
const FilterFormListControl: React.FC = () => {
  const { features } = useModel('feature');
  const [form] = Form.useForm();

  const dataSource = useMemo(() => {
    return features.map((item, index) => {
      const { properties } = item;
      return { __index: index + 1, ...properties };
    });
  }, [features]);

  const featureKeyList = Array.from(
    new Set(
      features
        .map((item) => {
          const { properties } = item;
          return Object.keys(properties);
        })
        .flat(),
    ),
  ).map((item) => {
    const newDataSource = [
      ...new Set(dataSource.map((v: any) => typeof v[item])),
    ];
    if (newDataSource.find((item) => item === 'string')) {
      return { value: item, type: 'string' };
    } else {
      return { value: item, type: newDataSource[0] };
    }
  });

  return (
    <CustomControl
      position="topright"
      style={{ display: 'flex', background: '#fff', padding: '16px' }}
    >
      <div style={{ width: '500px' }}>
        <Form form={form} onValuesChange={(_, all) => {}}>
          <Form.List name="filterFromList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <div key={key} style={{ display: 'flex' }}>
                    <Form.Item
                      name={[name, 'logic']}
                      style={{ flex: '0.5', marginRight: '8px' }}
                      initialValue="and"
                    >
                      <Select>
                        <Option value="and">并且</Option>
                        <Option value="or">或者</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={[name, 'field']}
                      style={{ flex: '1.2', marginRight: '8px' }}
                      initialValue={JSON.stringify(featureKeyList[0])}
                    >
                      <Select
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
                        }}
                      >
                        {featureKeyList.map(
                          (item: { value: string; type: string }) => {
                            return (
                              <Option value={JSON.stringify(item)}>
                                <i
                                  style={{
                                    color: typeColor[item.type],
                                    fontSize: 20,
                                    marginRight: 8,
                                  }}
                                >
                                  {item.type === 'string' ? (
                                    <FieldStringOutlined />
                                  ) : item.type === 'number' ? (
                                    <FieldNumberOutlined />
                                  ) : (
                                    item.type
                                  )}
                                </i>
                                {item.value}
                              </Option>
                            );
                          },
                        )}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.field === curValues.field
                      }
                      style={{ flex: '2.4' }}
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
                      type="link"
                      onClick={() => remove(name)}
                      icon={<CloseOutlined />}
                    />
                  </div>
                ))}
                <Button
                  type="link"
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
