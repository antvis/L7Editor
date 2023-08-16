import { Input } from 'antd';
import { debounce } from 'lodash';
import React, { forwardRef, useEffect, useState } from 'react';
import { useFeature } from '../../recoil';
import { IFeatures } from '../../types';
import { GeoJSON2Wkt, Wkt2GeoJSON } from '../../utils';

const { TextArea } = Input;

export const WktEditor: React.FC = forwardRef(() => {
  const [input, setInput] = useState('');
  const { fc, resetFeatures } = useFeature();

  useEffect(() => {
    const result = GeoJSON2Wkt(fc);
    if (result !== input) {
      setInput(result);
    }
  }, [fc]);

  const onInputChange = debounce(
    (wkt: string) => {
      const { features } = Wkt2GeoJSON(wkt);
      resetFeatures(features as IFeatures);
    },
    1000,
    {
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
      placeholder="输入WKT格式的点、线、面都可识别，多个数据请使;分隔，如：POINT(120.104013 30.262134);POINT(120.104033 30.262164)"
      onChange={(e) => {
        setInput(e.target.value);
        onInputChange(e.target.value);
      }}
    />
  );
});
