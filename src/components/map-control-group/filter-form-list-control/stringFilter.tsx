import type { FormInstance } from 'antd';
import { Form, Input, Select, Tooltip } from 'antd';
import { cloneDeep, uniq } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useFeature from '../../../recoil/feature';
import useFilter from '../../../recoil/filter';
import type { FilterStringData } from '../../../types/filter';

interface Props {
  name: number;
  index: number;
  form: FormInstance;
}
const StringFilter: React.FC<Props> = ({ name, index, form }) => {
  const { setFilters } = useFilter();
  const { dataSource } = useFeature();
  const { t } = useTranslation();

  const select = [
    { label: t('filter_form_list_control.stringFilter.baoHan'), value: 'IN' },
    {
      label: t('filter_form_list_control.stringFilter.buBaoHan'),
      value: 'NOT_IN',
    },
    { label: t('filter_form_list_control.stringFilter.piPei'), value: 'LIKE' },
    {
      label: t('filter_form_list_control.stringFilter.buPiPei'),
      value: 'NOT_LIKE',
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={[name, 'operator']}
        style={{ width: '100px', marginRight: '8px' }}
      >
        <Select
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
        shouldUpdate={(prevValues, curValues) =>
          prevValues.operator !== curValues.operator
        }
        style={{ width: 150, margin: 0 }}
      >
        {({ getFieldsValue }) => {
          const { filterFromList } = getFieldsValue();
          const fieldValue = JSON.parse(filterFromList[index].field)?.field;
          const DataList: FilterStringData | undefined = dataSource.find(
            (item) => item?.field === fieldValue,
          );
          const fieldType = filterFromList[index].operator;
          if (fieldType === 'LIKE' || fieldType === 'NOT_LIKE') {
            return (
              <Form.Item name={[name, 'value']}>
                <Input
                  placeholder={t(
                    'filter_form_list_control.numberFilter.qingShuRuShaiXuan',
                  )}
                  style={{ width: '100%' }}
                  allowClear
                />
              </Form.Item>
            );
          }
          return (
            <Form.Item name={[name, 'value']}>
              <Select
                placeholder={t(
                  'filter_form_list_control.stringFilter.qingXuanZeShaiXuan',
                )}
                style={{ width: '100%' }}
                mode="multiple"
                maxTagCount={1}
              >
                {(uniq(DataList?.value) ?? [])
                  .filter((item) => item !== 'undefined')
                  .map((item) => (
                    <Select.Option value={item} key={item}>
                      <Tooltip title={item}>{item}</Tooltip>
                    </Select.Option>
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
