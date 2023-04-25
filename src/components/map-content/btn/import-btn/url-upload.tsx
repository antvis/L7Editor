import { getUrlFeatureCollection } from '@/utils';
import { Form, Input, Radio } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const UrlUpload = forwardRef(({}, ref) => {
  const [inputValue, setInputValue] = useState<string>('');

  const [radioValue, setRadioValue] = useState<string>('GeoJSON');

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (inputValue) {
            resolve(getUrlFeatureCollection(inputValue, radioValue));
            reject('数据格式错误，请选择正确的数据类型');
          } else {
            reject('请输入文本内容');
          }
        }),
    }),
    [inputValue, radioValue],
  );

  return (
    <>
      <Form layout={'vertical'}>
        <Form.Item
          name="urlType"
          label="数据类型 :"
          rules={[{ required: true }]}
          style={{ marginTop: 16, marginBottom: 4 }}
        >
          <Radio.Group
            defaultValue="GeoJSON"
            onChange={(e) => {
              setRadioValue(e.target.value);
            }}
          >
            <Radio.Button value="GeoJSON">GeoJSON</Radio.Button>
            <Radio.Button value="WKT">WKT</Radio.Button>
            <Radio.Button value="KML">KML</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="url"
          label="URL地址 :"
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
    </>
  );
});

export default UrlUpload;
