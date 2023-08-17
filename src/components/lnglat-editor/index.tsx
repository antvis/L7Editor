import { Input } from 'antd';
import { debounce } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useFeature, useGlobal } from '../../recoil';
import { IFeatures } from '../../types';
import { GeoJSON2LngLat, LngLat2GeoJson } from '../../utils';

const { TextArea } = Input;

export const LngLatEditor: React.FC = () => {
  const [input, setInput] = useState('');
  const { fc, resetFeatures, bboxAutoFit } = useFeature();
  const { autoFitBounds } = useGlobal();

  useEffect(() => {
    const result = GeoJSON2LngLat(fc);
    if (result !== input) {
      setInput(result);
    }
  }, [fc]);

  const onInputChange = debounce(
    (input: string) => {
      const features = LngLat2GeoJson(input);
      if (features) {
        resetFeatures(features as IFeatures);
        if (autoFitBounds) {
          bboxAutoFit(features);
        }
      }
    },
    1000,
    {
      maxWait: 1000,
    },
  );
  return (
    <>
      <TextArea
        value={input}
        style={{
          margin: 8,
          height: 'calc(100% - 16px)',
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
