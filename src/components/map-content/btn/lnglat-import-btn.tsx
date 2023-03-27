import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, message, Modal, Radio, Tooltip } from 'antd';
import { useModel } from 'umi';
import { LngLatImportType } from '@/types';
import { featureCollection, FeatureCollection } from '@turf/turf';

const LngLatImportTypeOptions: Array<{
  label: string;
  value: LngLatImportType;
}> = [
  {
    label: '点',
    value: 'Point',
  },
  {
    label: '线',
    value: 'LingString',
  },
  {
    label: '面',
    value: 'Polygon',
  },
];
const LngLatImportBtn = forwardRef(({}, ref) => {
  const {
    lngLatText,
    setLngLatText,
    importLngLatText,
    lngLatImportType,
    setLngLatImportType,
  } = useModel('lnglat');

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (!lngLatText) {
            reject('请输入经纬度');
          }
          const data = importLngLatText(lngLatText);
          resolve(featureCollection(data));
          reject('LngLat 导入失败');
        }),
    }),
    [lngLatText, lngLatImportType],
  );

  return (
    <>
      <Form>
        <Form.Item style={{ marginTop: 16 }} label="数据类型">
          <Radio.Group
            value={lngLatImportType}
            buttonStyle="solid"
            onChange={(e) => {
              setLngLatImportType(e.target.value);
            }}
          >
            {LngLatImportTypeOptions.map((item) => (
              <Radio.Button key={item.value} value={item.value}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item style={{ marginTop: 16 }} label="数据内容">
          <Input.TextArea
            placeholder="请输入连续的经纬度并用符号隔开，例如：120.85,30.26;130.85,31.21"
            rows={10}
            onChange={(e) => {
              setLngLatText(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
});

export default LngLatImportBtn;
