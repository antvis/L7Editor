import { Form, Input } from 'antd';
import React, { Ref } from 'react';


const UrlUpload = () => {
  return (
    <Form.Item
      name="url"
      label="GeoJSON 地址"
      rules={[{ required: true }]}
      style={{ marginTop: 16 }}
    >
      <Input placeholder="https://..." />
      <div>仅支持GeoJson数据格式</div>
    </Form.Item>
  );
};

export default UrlUpload;
