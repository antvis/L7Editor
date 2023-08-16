import { Input } from 'antd';
import { throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFeature } from '../../recoil';
import { IFeatures } from '../../types';
import { GeoJSONtoLngLat, LngLattoGeoJson } from '../../utils/lnglat';

const { TextArea } = Input;

export const LinLatEditor = () => {
  const [input, setInput] = useState('');
  const { fc, resetFeatures } = useFeature();

  useEffect(() => {
    const result = GeoJSONtoLngLat(fc);
    if (result !== input) {
      setInput(result);
    }
  }, [fc]);

  const onInputChange = throttle((lngLat: string) => {
    const features = LngLattoGeoJson(lngLat);
    console.log(features);
    if (features) {
      resetFeatures(features as IFeatures);
    }
  }, 1000);
  return (
    <>
      <TextArea
        value={input}
        style={{
          margin: 8,
          height: 'calc(100% - 45px)',
          width: 'calc(100% - 16px)',
        }}
        placeholder="请输入连续的经纬度并用符号隔开，例如：120.85,30.26;130.85,31.21"
        onChange={(e) => {
          setInput(e.target.value);
          onInputChange(e.target.value);
        }}
      />
    </>
  );
};
