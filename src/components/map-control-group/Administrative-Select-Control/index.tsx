import { LineLayer, LineLayerProps } from '@antv/larkmap';
import {
  Feature,
  featureCollection,
  MultiLineString,
  multiLineString,
} from '@turf/turf';
import { Cascader, message } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { LayerZIndex } from '../../../constants';
import { useFeature } from '../../../recoil';
import './style.less';
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
  const { scene } = useFeature();
  const [districtFeature, setDistrictFeature] =
    useState<Feature<MultiLineString> | null>(null);
  const [data, setData] = useState();

  const getCascadeData = (list: any) => {
    list.sort((a: { adcode: number }, b: { adcode: number }) => {
      return +a.adcode - +b.adcode;
    });
    if (list.length) {
      return list.map((item: any) => {
        const { center, name, districts, adcode } = item;
        return {
          adcode,
          value: center,
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
  }, []);

  const onChange = debounce((value: string[], option: any) => {
    if (option) {
      const data = option[option.length - 1];
      const name = data.adcode;
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
          message.error('围栏数据请求失败');
        });
    } else {
      setDistrictFeature(null);
    }
  }, 1500);

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) =>
        (option.label as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) > -1,
    );

  return (
    <>
      <Cascader
        options={data}
        onChange={onChange}
        allowClear
        showSearch={{ filter }}
        placeholder="可选择省/市/县"
        changeOnSelect
        style={{ width: 250 }}
        popupClassName={styles.cascaderPopup}
      />

      <LineLayer
        source={{
          data: featureCollection(districtFeature ? [districtFeature] : []),
        }}
        {...DistrictLayerOptions}
      />
    </>
  );
};
