import type { LineLayerProps } from '@antv/larkmap';
import { CustomControl, LineLayer } from '@antv/larkmap';
import type { Feature, MultiLineString } from '@turf/turf';
import { featureCollection, multiLineString } from '@turf/turf';
import { Cascader, Dropdown, Empty, Tooltip, message } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import classNames from 'classnames';
import { cloneDeep } from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayerZIndex } from '../../../constants';
import { useFeature, useGlobal } from '../../../recoil';
import { IconFont } from '../../iconfont';
import { useStyle } from './styles';

const DistrictLayerOptions: Omit<LineLayerProps, 'source'> = {
  shape: 'line',
  color: '#ff0000',
  size: 2,
  zIndex: LayerZIndex,
  style: {
    opacity: 0.8,
  },
};

export const AdministrativeSelect = () => {
  const styles = useStyle();
  const { cityHistory, setCityHistory } = useGlobal();
  const { scene } = useFeature();
  const [districtFeature, setDistrictFeature] =
    useState<Feature<MultiLineString> | null>(null);
  const [data, setData] = useState();
  const [value, setValue] = useState<string[]>([]);
  const { t } = useTranslation();

  const getCascadeData = (list: any) => {
    list.sort((a: { adcode: number }, b: { adcode: number }) => {
      return +a.adcode - +b.adcode;
    });
    if (list.length) {
      return list.map((item: any) => {
        const { name, districts, adcode } = item;
        return {
          adcode,
          value: adcode,
          label: name,
          children: getCascadeData(districts),
        };
      });
    } else {
      return [];
    }
  };

  useEffect(() => {
    fetch(
      'https://restapi.amap.com/v3/config/district?key=98d10f05a2da96697313a2ce35ebf1a2&keywords=中华人民共和国&subdistrict=3&extensions=base',
    )
      .then((res) => res.json())
      .then((res) => {
        setData(getCascadeData(res.districts[0].districts));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (items: string[], option: any) => {
    setValue(items);
    if (option) {
      const code: string[] = [];
      const label: string[] = [];
      option.forEach((item: { adcode: string; label: string }) => {
        code.push(item.adcode);
        label.push(item.label);
      });
      const item = { value: JSON.stringify(code), label: label.join('/') };
      const arr = [item, ...cityHistory];
      const formatArr = () => {
        const map = new Map();
        for (const o of arr) {
          if (!map.has(o.value)) {
            map.set(o.value, o);
          }
        }
        //@ts-ignore
        return [...map.values()];
      };
      setCityHistory(formatArr());
      if (cityHistory.length >= 10) {
        const arrHistory = cloneDeep(cityHistory);
        arrHistory.pop();
        setCityHistory(arrHistory);
      }
    } else {
      setDistrictFeature(null);
    }
  };

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) =>
        (option.label as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) > -1,
    );

  const historyItem = useMemo(() => {
    if (cityHistory.length) {
      const item = cityHistory.map((city) => {
        return {
          key: city.value,
          label: (
            <div
              onClick={() => {
                setValue(JSON.parse(city.value));
              }}
            >
              {city.label}
            </div>
          ),
        };
      });
      return item;
    } else {
      return [{ key: 'undefined', label: <Empty /> }];
    }
  }, [cityHistory]);

  useEffect(() => {
    if (value) {
      const name = value[value.length - 1];
      fetch(
        `https://restapi.amap.com/v3/config/district?keywords=${name}&subdistrict=0&key=98d10f05a2da96697313a2ce35ebf1a2&extensions=all`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.status === '1' && res.districts?.length && scene) {
            const [lng, lat] = (res.districts[0].center as string)
              .split(',')
              .map((item) => +item);
            scene.setZoomAndCenter(9, [lng, lat]);
            const positions: number[][][] = [];

            res.districts.forEach((district: any) => {
              (district.polyline as string).split('|').forEach((chunk) => {
                positions.push(
                  chunk
                    .split(';')
                    .map((item) => item.split(',').map((num) => +num)),
                );
              });
            });
            setDistrictFeature(multiLineString(positions));
          }
        })
        .catch(() => {
          message.error(
            t('administrative_select_control.index.weiLanShuJuQing'),
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <CustomControl position="lefttop">
        <div style={{ display: 'flex' }}>
          <div id="l7-editor-administrativeSelect">
            <Cascader
              options={data}
              value={value}
              // @ts-ignore
              onChange={onChange}
              className={styles.cascader}
              allowClear
              showSearch={{ filter }}
              placeholder={t(
                'administrative_select_control.index.keXuanZeShengShi',
              )}
              changeOnSelect
              style={{ width: 250 }}
              popupClassName={styles.cascaderPopup}
              expandTrigger="hover"
            />
          </div>
          <Dropdown
            menu={{
              items: historyItem,
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Tooltip
              title={t('administrative_select_control.index.xingZhengQuHuaLi')}
              placement="right"
            >
              <div
                className={classNames([styles.history, 'l7-draw-control__btn'])}
              >
                <IconFont type="icon-lishi" className={styles.historyIcon} />
              </div>
            </Tooltip>
          </Dropdown>
        </div>
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
