import I18N from '@/locales';
import { useDebounceFn } from 'ahooks';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useFeature, useGlobal } from '../../recoil';
import { IFeatures } from '../../types';
import { GeoJSON2LngLat, LngLat2GeoJson } from '../../utils';

const { TextArea } = Input;

export const LngLatEditor: React.FC = () => {
  const [input, setInput] = useState('');
  const { fc, resetFeatures, bboxAutoFit } = useFeature();
  const { autoFitBounds } = useGlobal();
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (isFocus) {
      return;
    }
    const result = GeoJSON2LngLat(fc);
    if (result !== input) {
      setInput(result);
    }
  }, [fc, isFocus]);

  const { run: onInputChange } = useDebounceFn(
    (input: string) => {
      const features = LngLat2GeoJson(input);
      if (features) {
        resetFeatures(features as IFeatures);
        if (autoFitBounds) {
          bboxAutoFit(features);
        }
      }
    },
    {
      wait: 1000,
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
        placeholder={I18N.t('import_btn.lnglat_import_btn.qingShuRuLianXu')}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(e) => {
          setInput(e.target.value);
          onInputChange(e.target.value);
        }}
      />
    </>
  );
};
