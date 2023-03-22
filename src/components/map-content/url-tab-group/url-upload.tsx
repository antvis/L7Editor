import { Form, Input } from 'antd';
import React, { Ref } from 'react';

interface Props {
  ref: Ref<any>;
}
const UrlUpload = ({ ref }: Props) => {
  return (
    <Form.Item
      name="url"
      label="GeoJSON 地址"
      rules={[{ required: true }, { type: 'url' }]}
      style={{ marginTop: 16 }}
    >
      <Input placeholder="https://..." />
    </Form.Item>
  );
};

export default UrlUpload;
