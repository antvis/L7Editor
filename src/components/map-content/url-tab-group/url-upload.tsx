import { getParamsNew } from '@/utils';
import { useMount, useUpdate } from 'ahooks';
import { Form, Input, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const UrlUpload = forwardRef(({}, ref) => {
  const [inputGeoData, setInputGeoData] = useState(undefined);
  const [inputValue, setInputValue] = useState<string>('');
  const checkWithRestData = async (e: string) => {
    try {
      const json = await fetch(e);
      const geoData = await json.json();
      return geoData;
    } catch (e) {
      setInputGeoData(undefined);
      message.error('接口请求失败');
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (inputValue) {
            resolve(checkWithRestData(inputValue));
            reject('数据格式错误，仅支持 GeoJSON 格式');
          } else {
            reject('请输入文本内容');
          }
        }),
    }),
    [inputGeoData, inputValue],
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
              setInputValue(e.target.value);
              // checkWithRestData(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
      <div style={{ color: '#777' }}>仅支持GeoJson数据格式</div>
    </>
  );
});

export default UrlUpload;
