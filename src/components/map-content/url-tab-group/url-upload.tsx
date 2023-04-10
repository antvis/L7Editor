import { getUrlFeatureCollection } from '@/utils';
import { Form, Input } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const UrlUpload = forwardRef(({}, ref) => {
  const [inputValue, setInputValue] = useState<string>('');

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (inputValue) {
            resolve(getUrlFeatureCollection(inputValue));
            reject('数据格式错误，仅支持 GeoJSON 格式');
          } else {
            reject('请输入文本内容');
          }
        }),
    }),
    [inputValue],
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
