import { isEmptyFilter } from '@/hooks/useFilterFeature';
import { FilterNode } from '@/types/filter';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FieldBinaryOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import { Button, Form, Select } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useModel } from 'umi';
import BooleanFilter from './booleanFilter';
import NumberFilter from './numberFilter';
import StringFilter from './stringFilter';
const { Option } = Select;
const FilterFormListControl: React.FC = () => {
  const { featureKeyList } = useModel('feature');
  const { setFilter, filter } = useModel('filter');
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  const onValuesChange = (_: any, all: any) => {
    if (isEmpty(all.filterFromList)) {
      setFilter([]);
      return;
    }
    const newValue = all.filterFromList
      .filter((item: any) => item)
      .map((item: any) => {
        const { logic, operator } = item;
        if (item.field) {
          const { field, type } = JSON.parse(item.field || '');
          if (item.operator === 'BETWEEN') {
            if (item.min && item.max) {
              return {
                logic,
                field,
                type,
                operator,
                value: [item.min, item.max],
              };
            }
          }
          if (
            (item.operator === 'IN' || item.operator === 'NO_IN') &&
            item.value
          ) {
            return {
              ...item,
              field,
              type,
              value: item.value.length ? item.value : undefined,
            };
          }
          return { ...item, field, type };
        } else {
          return { ...item, field: undefined, type: undefined };
        }
      });
    setFilter(newValue);
  };
  const isFilterActive = useMemo(() => {
    console.log(filter.filter((item) => isEmptyFilter(item)));
    return filter.filter((item) => isEmptyFilter(item)).find((item) => item);
  }, [filter]);

  return (
    <CustomControl position="topright" style={{ display: 'flex' }}>
      <div
        className="l7-filter"
        style={{ display: isVisible ? 'block' : 'none' }}
      >
        <Form
          style={{ width: '100%' }}
          form={form}
          onValuesChange={onValuesChange}
        >
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
                        field: featureKeyList[0]?.field,
                        type: featureKeyList[0]?.type,
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
                            return (
                              <NumberFilter
                                name={name}
                                index={index}
                                form={form}
                              />
                            );
                          }
                          if (type === 'boolean') {
                            return <BooleanFilter name={name} />;
                          }
                          return (
                            <StringFilter
                              name={name}
                              index={index}
                              form={form}
                            />
                          );
                        }
                      }}
                    </Form.Item>
                    <Button
                      type="text"
                      onClick={() => {
                        remove(name);
                        setFilter(form.getFieldValue('filterFromList'));
                      }}
                      icon={<DeleteOutlined />}
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                  style={{ width: 500 }}
                >
                  添加筛选条件
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </div>
      <div className="l7-filter-switch">
        <button
          style={{
            color: isFilterActive ? '#597ef7' : '',
          }}
          className="l7-draw-control__btn"
          onClick={() => {
            setIsVisible(!isVisible);
          }}
        >
          <FilterOutlined
            className="l7-draw-icon"
            style={{
              lineHeight: '30px',
            }}
          />
        </button>
      </div>
    </CustomControl>
  );
};

export default FilterFormListControl;
