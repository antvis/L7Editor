import type { FormInstance } from 'antd';
import { Form, InputNumber, Select } from 'antd';
import { cloneDeep } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeature, useFilter } from '../../../recoil';
import type { FilterNumberData } from '../../../types';

interface Props {
  name: number;
  index: number;
  form: FormInstance;
}
const NumberFilter: React.FC<Props> = ({ name, index, form }) => {
  const { setFilters } = useFilter();
  const { dataSource } = useFeature();
  const { t } = useTranslation();

  const select = [
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '=', value: '=' },
    { label: '<=', value: '<=' },
    { label: '<', value: '<' },
    {
      label: t('filter_form_list_control.numberFilter.quJian'),
      value: 'BETWEEN',
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item name={[name, 'operator']}>
        <Select
          style={{ width: '100px', marginRight: '8px' }}
          placeholder={t(
            'filter_form_list_control.numberFilter.qingXuanZeGuoLu',
          )}
          options={select}
          onChange={() => {
            const newFilterFromList = cloneDeep(
              form.getFieldValue('filterFromList'),
            );

            newFilterFromList.forEach((v: any, i: number) => {
              if (index === i) {
                v.value = undefined;
              }
            });
            form.setFieldValue('filterFromList', newFilterFromList);
            setFilters(
              newFilterFromList.map((item: any) => {
                const { field, type } = JSON.parse(item.field);
                return { ...item, field, type };
              }),
            );
          }}
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
          const DataList: FilterNumberData | undefined = dataSource.find(
            (item) => item?.field === fieldValue,
          );
          if (filterFromList[index].operator === 'BETWEEN') {
            return (
              <div>
                <Form.Item name={[name, 'min']} style={{ width: '70px' }}>
                  <InputNumber
                    placeholder={t(
                      'filter_form_list_control.numberFilter.qingShuRuShaiXuan',
                    )}
                    style={{ width: '100%' }}
                    min={DataList?.min ?? 0}
                    max={DataList?.max ?? 0}
                  />
                </Form.Item>
                <span> - </span>
                <Form.Item name={[name, 'max']} style={{ width: '70px' }}>
                  <InputNumber
                    placeholder={t(
                      'filter_form_list_control.numberFilter.qingShuRuShaiXuan',
                    )}
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
                placeholder={t(
                  'filter_form_list_control.numberFilter.qingShuRuShaiXuan',
                )}
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
