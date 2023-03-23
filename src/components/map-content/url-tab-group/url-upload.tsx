import { getParamsNew } from '@/utils';
import { useMount } from 'ahooks';
import { Form, Input } from 'antd';
import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';

const UrlUpload = forwardRef(({}, ref) => {
  const [inputValue, setInputValue] = useState(undefined);
  const checkWithRestData = async (e: string) => {
    const json = await fetch(e);
    const geoData = await json.json();
    setInputValue(geoData);
  };
  useMount(async () => {
    const url = getParamsNew('url');
    if (url) {
      checkWithRestData(url);
    }
  });

  useImperativeHandle(
    ref,
    () => ({
      url: () =>
        new Promise((resolve, reject) => {
          if (inputValue) {
            resolve(inputValue);
          } else {
            reject('数据格式错误，仅支持 GeoJSON 格式');
          }
        }),
    }),
    [inputValue],
  );

  return (
    <>
      <Form.Item
        name="url"
        label="GeoJSON 地址"
        rules={[{ required: true }]}
        style={{ marginTop: 16, marginBottom: 4 }}
      >
        <Input
          placeholder="https://..."
          onChange={(e) => {
            checkWithRestData(e.target.value);
          }}
        />
      </Form.Item>
      <div style={{ color: '#777' }}>仅支持GeoJson数据格式</div>
    </>
  );
});

export default UrlUpload;
