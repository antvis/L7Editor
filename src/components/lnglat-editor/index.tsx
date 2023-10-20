import { useDebounceFn } from 'ahooks';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeature, useGlobal } from '../../recoil';
import type { IFeatures } from '../../types';
import { GeoJSON2LngLat, LngLat2GeoJson } from '../../utils';

const { TextArea } = Input;

export const LngLatEditor: React.FC = () => {
  const [input, setInput] = useState('');
  const { fc, resetFeatures, bboxAutoFit } = useFeature();
  const { autoFitBounds } = useGlobal();
  const [isFocus, setIsFocus] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isFocus) {
      return;
    }
    const result = GeoJSON2LngLat(fc);
    if (result !== input) {
      setInput(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fc, isFocus]);

  const { run: onInputChange } = useDebounceFn(
    (newInput: string) => {
      const features = LngLat2GeoJson(newInput);
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
        placeholder={t('import_btn.lnglat_import_btn.qingShuRuLianXu')}
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
