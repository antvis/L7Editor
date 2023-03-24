import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Input, message, Modal, Radio, Tooltip } from 'antd';
import { useModel } from 'umi';
import { LngLatImportType } from '@/types';
import { featureCollection, FeatureCollection } from '@turf/turf';

const LngLatImportBtn = forwardRef(
  (
    {
      item,
    }: {
      item: {
        label: string;
        value: LngLatImportType;
        placeholder: string;
      };
    },
    ref,
  ) => {
    const { lngLatText, setLngLatText, importLngLatText } = useModel('lnglat');
    const { placeholder, value } = item;

    useImperativeHandle(
      ref,
      () => {
        const obj: Record<string, (e: string) => Promise<FeatureCollection>> =
          {};
        obj[value] = () =>
          new Promise((resolve, reject) => {
            const data = importLngLatText(lngLatText);
            resolve(featureCollection(data));
            reject('LngLat 导入失败');
          });
        return obj;
      },
      [lngLatText],
    );

    return (
      <>
        <Input.TextArea
          style={{ marginTop: 16 }}
          placeholder={placeholder}
          value={lngLatText}
          rows={10}
          onChange={(e) => {
            setLngLatText(e.target.value);
          }}
        />
      </>
    );
  },
);

export default LngLatImportBtn;
