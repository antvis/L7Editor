import I18N from '@/locales';
import { useDebounceFn } from 'ahooks';
import { Input } from 'antd';
import React, { forwardRef, useEffect, useState } from 'react';
import { useFeature, useGlobal } from '../../recoil';
import type { IFeatures } from '../../types';
import { GeoJSON2Wkt, Wkt2GeoJSON } from '../../utils';

const { TextArea } = Input;

export const WktEditor: React.FC = forwardRef(() => {
  const [input, setInput] = useState('');
  const { fc, resetFeatures, bboxAutoFit } = useFeature();
  const [isFocus, setIsFocus] = useState(false);
  const { autoFitBounds } = useGlobal();

  useEffect(() => {
    if (isFocus) {
      return;
    }
    //@ts-ignore
    const result = GeoJSON2Wkt(fc).replaceAll(' (', '(');
    if (result !== input) {
      setInput(result);
    }
  }, [fc, isFocus]);

  const { run: onInputChange } = useDebounceFn(
    (wkt: string) => {
      //@ts-ignore
      const newWkt = wkt.replaceAll('(', ' (');
      const { features } = Wkt2GeoJSON(newWkt);
      resetFeatures(features as IFeatures);
      if (autoFitBounds) {
        bboxAutoFit(features);
      }
    },
    {
      wait: 1000,
      maxWait: 1000,
    },
  );

  return (
    <TextArea
      value={input}
      style={{
        margin: 8,
        height: 'calc(100% - 16px)',
        width: 'calc(100% - 16px)',
      }}
      placeholder={I18N.t('wkt_editor.index.shuRuWKT')}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(e) => {
        setInput(e.target.value);
        onInputChange(e.target.value);
      }}
    />
  );
});
