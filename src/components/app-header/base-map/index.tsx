import { Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from '../../../recoil';

const { Option } = Select;

export const BaseMap = () => {
  const {
    baseMap,
    setBaseMap,
    setMapOptions,
    mapOptions,
    theme,
    setCoordConvert,
  } = useGlobal();
  const { t } = useTranslation();

  const options = [
    {
      img: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*POJeRJzjdNAAAAAAAAAAAAAADjWqAQ/original',
      label: t('btn.setting_btn.gaoDe'),
      value: 'Gaode',
    },
    {
      img: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*-G-sT4L_sNoAAAAAAAAAAAAADjWqAQ/original',
      label: 'Mapbox',
      value: 'Mapbox',
    },
    {
      img: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*YKJtR5vfbtIAAAAAAAAAAAAADjWqAQ/original',
      label: t('btn.setting_btn.tencent'),
      value: 'Tencent',
    },
    {
      img: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*kRvdTLte60cAAAAAAAAAAAAADjWqAQ/original',
      label: t('btn.setting_btn.baidu'),
      value: 'Baidu',
    },
  ];

  const handleChange = (e: 'Gaode' | 'Mapbox' | 'Baidu' | 'Tencent') => {
    setBaseMap(e);
    setMapOptions({
      ...mapOptions,
      style: theme === 'dark' ? 'dark' : 'normal',
    });
    setCoordConvert(e === 'Gaode' ? 'GCJ02' : e === 'Baidu' ? 'BD09' : 'WGS84');
    if (e !== baseMap) {
      location.reload();
    }
  };
  return (
    <Select
      style={{ width: '120px' }}
      bordered={false}
      defaultValue={baseMap}
      onChange={handleChange}
    >
      {options.map((item) => {
        return (
          <Option key={item.value} value={item.value} label={item.label}>
            <Space>
              <span style={{ display: 'flex' }}>
                <img src={item.img} alt="" style={{ height: 15, width: 15 }} />
              </span>
              <span>{item.label}</span>
            </Space>
          </Option>
        );
      })}
    </Select>
  );
};
