import { getUrlFeatureCollection } from '@/utils';
import { Form, Input, Radio } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const UrlUpload = forwardRef(({}, ref) => {
  const [inputValue, setInputValue] = useState<string>('');

  const [radioValue, setRadioValue] = useState<string>('JSON');

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
      <Form>
        <Form.Item
          name="urlType"
          label="URL类型"
          rules={[{ required: true }]}
          style={{ marginTop: 16, marginBottom: 4 }}
          tooltip="请选择url数据类型"
        >
          <Radio.Group
            defaultValue="JSON"
            onChange={(e) => {
              setRadioValue(e.target.value);
            }}
          >
            <Radio.Button value="JSON">JSON</Radio.Button>
            <Radio.Button value="WKT">WKT</Radio.Button>
            <Radio.Button value="KML">KML</Radio.Button>
            {/* <Radio.Button value="d">Chengdu</Radio.Button> */}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="url"
          label="URL"
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
