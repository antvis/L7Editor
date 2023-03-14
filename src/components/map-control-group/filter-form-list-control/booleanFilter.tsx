import { Form, Radio } from 'antd';
import React from 'react';
interface Props {
  name: number;
}
const BooleanFilter: React.FC<Props> = ({ name }) => {
  return (
    <Form.Item name={[name, 'value']} style={{ flex: '1.2' }}>
      <Radio.Group size="small">
        <Radio value={true}>true</Radio>
        <Radio value={false}>false</Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default BooleanFilter;
