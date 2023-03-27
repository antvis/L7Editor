import { getParamsNew } from '@/utils';
import { useMount } from 'ahooks';
import { Form, Input } from 'antd';
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

const UrlUpload = forwardRef(({}, ref) => {
  const [inputGeoData, setInputGeoData] = useState(undefined);
  const [inputValue, setInputValue] = useState<string>('');
  const checkWithRestData = async (e: string) => {
    const json = await fetch(e);
    const geoData = await json.json();
    setInputGeoData(geoData);
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
      getData: () =>
        new Promise((resolve, reject) => {
          if (!inputValue) {
            reject('请输入文本内容');
          }
          if (inputGeoData) {
            resolve(inputGeoData);
          } else {
            reject('数据格式错误，仅支持 GeoJSON 格式');
          }
        }),
    }),
    [inputGeoData],
  );

  return (
    <>
      <Form>
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
              setInputValue(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
      <div style={{ color: '#777' }}>仅支持GeoJson数据格式</div>
    </>
  );
});

export default UrlUpload;
