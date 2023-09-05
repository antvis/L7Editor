import { useDebounceFn } from 'ahooks';
import { Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import I18N from '../../../locales';
import useStyle from './styles';
import type { LocationSearchOption, LocationSearchProps } from './types';
import { urlStringify } from './utils';

const { Option } = Select;

export const LocationSearch: React.FC<LocationSearchProps> = ({
  searchParams,
  showDistrict,
  showAddress,
  onSearchFinish,
  onChange,
  ...selectProps
}) => {
  const styles = useStyle();
  const [options, setOptions] = useState<LocationSearchOption[]>([]);

  useEffect(() => {
    onSearchFinish?.(options);
  }, [onSearchFinish, options]);

  const { run: onSearch } = useDebounceFn(
    async (searchText: string) => {
      if (!searchText) {
        setOptions([]);
        return;
      }
      const url = urlStringify(
        'https://restapi.amap.com/v3/assistant/inputtips',
        {
          ...searchParams,
          keywords: [...(searchParams.keywords ?? '').split('|'), searchText]
            .filter((item) => !!item)
            .join('|'),
        },
      );
      const res = await (await fetch(url)).json();
      setOptions(
        (res?.tips ?? [])
          .filter((item: any) => item.location && item.location.length)
          .map((item: any) => {
            const [lon, lat] = item.location.split(',');
            item.longitude = +lon;
            item.latitude = +lat;
            return item;
          }),
      );
    },
    {
      wait: 1000,
    },
  );

  const onLocationChange = useCallback(
    (name?: string) => {
      const targetOption =
        name && options.find((option) => option.name === name);
      onChange?.(name || undefined, targetOption || undefined);
    },
    [onChange, options],
  );

  return (
    <Select
      className={styles.locationSearch}
      onSearch={onSearch}
      onChange={onLocationChange}
      clearIcon={() => null}
      {...selectProps}
    >
      {options.map((option) => {
        const tip = `${showDistrict ? option.district : ''}${
          showAddress ? option.address : ''
        }`;
        return (
          <Option key={option.id} value={option.name}>
            <div title={option.name} className={styles.locationSearchName}>
              {option.name}
            </div>
            {tip && (
              <div title={tip} className={styles.locationSearchTip}>
                {tip}
              </div>
            )}
          </Option>
        );
      })}
    </Select>
  );
};

LocationSearch.defaultProps = {
  placeholder: I18N.t(
    'location_search_control.location_search.qingShuRuYaoSou',
  ),
  showSearch: true,
  allowClear: true,
  filterOption: false,
  defaultActiveFirstOption: false,
  showAddress: true,
  showDistrict: true,
};
