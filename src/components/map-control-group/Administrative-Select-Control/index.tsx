import { CaretDownOutlined, CloseOutlined } from '@ant-design/icons';
import { CustomControl, LineLayer, LineLayerProps } from '@antv/larkmap';
import { Feature, featureCollection, LineString, lineString } from '@turf/turf';
import { Button, message, Popover, Select, Spin, Tabs } from 'antd';
import cls from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { LayerZIndex } from '../../../constants';
import { useFeature } from '../../../recoil';
import { CityContent } from './Component/CityView';
import { ProvinceContent } from './Component/ProvinceView';
import { CityUrl, CLS_PREFIX } from './constant';
import { parserCityData, treeToArr } from './helper';
import useStyle from './style';
import type { ICity, IData } from './types';

const DistrictLayerOptions: Omit<LineLayerProps, 'source'> = {
  shape: 'line',
  color: '#ff0000',
  size: 4,
  zIndex: LayerZIndex,
  style: {
    opacity: 0.8,
  },
};

export const AdministrativeSelectControl = () => {
  const { scene } = useFeature();
  const style = useStyle();
  const [cityName, setCityName] = useState('全国');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cityData, setCityData] = useState<IData>();
  const [selectCity, setSelectCity] = useState<ICity | null>(null);
  const [districtFeature, setDistrictFeature] =
    useState<Feature<LineString> | null>(null);

  useEffect(() => {
    fetch(CityUrl)
      .then((res) => res.json())
      .then((res) => {
        setCityData(parserCityData(res) as IData);
      });
  }, []);

  const cityOptions = useMemo(() => {
    if (!cityData) return [];
    return treeToArr([cityData.cities]).map((item) => {
      return {
        ...item,
        label: `${item.name}(${item.spell})`,
      } as ICity;
    });
  }, [cityData]);

  useEffect(() => {
    if (selectCity) {
      setLoading(true);
      if (selectCity.level === 'country' && scene) {
        setLoading(false);
        scene.setZoomAndCenter(3, [116.3683244, 39.915085]);
        return;
      }
      setLoading(true);
      fetch(
        `https://restapi.amap.com/v3/config/district?keywords=${selectCity.name}&subdistrict=0&key=98d10f05a2da96697313a2ce35ebf1a2&extensions=all`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.status === '1' && res.districts?.length && scene) {
            const [lng, lat] = (res.districts[0].center as string)
              .split(',')
              .map((item) => +item);
            scene.setZoomAndCenter(11, [lng, lat]);
            const positions = (res.districts[0].polyline as string)
              .split(';')
              .map((item) => item.split(',').map((num) => +num));
            setDistrictFeature(lineString(positions));
          }
        })
        .catch(() => {
          message.error('围栏数据请求失败');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDistrictFeature(null);
    }
  }, [selectCity]);

  const onClickItem = (city: ICity) => {
    setOpen(false);
    setCityName(city.name);
    if (city) {
      setSelectCity(city);
    }
  };

  const items = [
    {
      label: '按省份',
      key: 'province',
      children: (
        <ProvinceContent
          onClickItem={onClickItem}
          cityData={cityData as IData}
        />
      ),
    },
    {
      label: '按城市',
      key: 'city',
      children: (
        <CityContent onClickItem={onClickItem} cityData={cityData as IData} />
      ),
    },
  ];

  const extraContent = (
    <Select
      popupClassName={style.selectOption}
      size="small"
      showSearch
      placeholder="请输入城市"
      optionFilterProp="children"
      onChange={(adCode, city) => {
        onClickItem(city as ICity);
      }}
      style={{ width: 150 }}
      filterOption={(input, item) =>
        (item?.label as string).toLowerCase().includes(input.toLowerCase())
      }
      fieldNames={{
        label: 'label',
        value: 'adcode',
      }}
      options={cityOptions}
    />
  );

  const content = (
    <div className={cls(`${CLS_PREFIX}__content`)}>
      <div
        className={cls(`${CLS_PREFIX}__content-header`, style.tabContentTitle)}
      >
        {cityData &&
          cityData.hotCities.map((hot) => {
            return (
              <div
                key={hot.name}
                onClick={() => onClickItem(hot as ICity)}
                className={cls(
                  `${CLS_PREFIX}__content-header-item`,
                  style.tabContentItem,
                )}
              >
                {hot.name.replace('市', '')}
              </div>
            );
          })}
      </div>
      <Tabs
        size="small"
        defaultActiveKey="province"
        tabBarExtraContent={extraContent}
        items={items}
        destroyInactiveTabPane
      />
    </div>
  );

  const onRest = () => {
    setCityName('全国');
    setSelectCity(null);
  };

  const getTitle = () => {
    return (
      <div className={style.popoverName}>
        <div>所在区域:{cityName.replace('市', '').replace('省', '')}</div>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => onRest()}
          style={{ marginLeft: 8 }}
        />
      </div>
    );
  };

  return (
    <>
      <CustomControl position={'topleft'} className={CLS_PREFIX}>
        <Popover
          overlayClassName={cls(`${CLS_PREFIX}__popover`, style.popover)}
          placement={'right'}
          title={getTitle()}
          content={content}
          open={open}
          onOpenChange={setOpen}
          trigger="click"
          destroyTooltipOnHide
        >
          <Spin spinning={loading}>
            <div className={cls(`${CLS_PREFIX}`, style.popoverContent)}>
              <div className={cls(`${CLS_PREFIX}__title`, style.popoverTitle)}>
                <div
                  className={cls(
                    `${CLS_PREFIX}__title-name`,
                    style.popoverTitleName,
                  )}
                >
                  {cityName.replace('市', '').replace('省', '')}
                </div>
                <CaretDownOutlined rotate={open ? 180 : 0} />
              </div>
            </div>
          </Spin>
        </Popover>
      </CustomControl>

      <LineLayer
        source={{
          data: featureCollection(districtFeature ? [districtFeature] : []),
        }}
        {...DistrictLayerOptions}
      />
    </>
  );
};
