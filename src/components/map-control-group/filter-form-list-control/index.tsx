import { isEmptyFilter } from '@/hooks/useFilterFeature';
import { useFeature, useFilter } from '@/recoil';
import {
  DeleteOutlined,
  FieldBinaryOutlined,
  FieldStringOutlined,
  FilterFilled,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import { Button, Form, Select, Tooltip } from 'antd';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import React, { useMemo, useState } from 'react';
import NumberFilter from './numberFilter';
import StringFilter from './stringFilter';
const { Option } = Select;
const FilterFormListControl: React.FC = () => {
  const { dataSource } = useFeature();
  const { setFilters, filters } = useFilter();
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  const addVisible = useMemo(() => {
    return !dataSource.length;
  }, [dataSource]);

  const onValuesChange = (_: any, all: any) => {
    if (isEmpty(all.filterFromList)) {
      setFilters([]);
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
    setFilters(newValue);
  };
  const isFilterActive = useMemo(() => {
    return filters.filter((item) => !isEmptyFilter(item)).find((item) => item);
  }, [filters]);

  return (
    <CustomControl position="topright" style={{ display: 'flex', }}>
      <div
        className="l7-filter"
        style={{ display: isVisible ? 'block' : 'none' }}
      >
        <Form
          style={{ width: '100%' }}
          form={form}
          onValuesChange={debounce(onValuesChange, 500)}
        >
          <Form.List name="filterFromList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name }, index) => (
                  <div
                    key={index.toString()}
                    style={{ display: 'flex', marginBottom: 8 }}
                  >
                    <Form.Item name={[name, 'logic']} initialValue="and">
                      <Select style={{ width: 70, marginRight: '8px' }}>
                        <Option value="and">并且</Option>
                        <Option value="or">或者</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={[name, 'field']}
                      initialValue={JSON.stringify({
                        field: dataSource[0]?.field,
                        type: dataSource[0]?.type,
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
                          setFilters(
                            newFilterFromList.map((item: any) => {
                              const { field, type } = JSON.parse(item.field);
                              return { ...item, field, type };
                            }),
                          );
                        }}
                      >
                        {dataSource.map(({ field, type }) => {
                          return (
                            <Option
                              key={field}
                              value={JSON.stringify({ field, type })}
                            >
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
                              <Tooltip title={field}>{field}</Tooltip>
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
                        setFilters(form.getFieldValue('filterFromList'));
                      }}
                      icon={<DeleteOutlined />}
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  disabled={addVisible}
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
          type="button"
          className="l7-draw-control__btn"
          onClick={() => {
            setIsVisible(!isVisible);
          }}
        >
          {!isFilterActive ? (
            <FilterOutlined
              // className="l7-draw-icon"
              style={{
                lineHeight: '30px',
              }}
            />
          ) : (
            <FilterFilled
              style={{
                color: '#597ef7',
              }}
            />
          )}
        </button>
      </div>
    </CustomControl>
  );
};

export default FilterFormListControl;
