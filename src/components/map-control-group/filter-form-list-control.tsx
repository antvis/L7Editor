import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import { Button, Form, Select } from 'antd';
import React from 'react';
const { Option } = Select;
const FilterFormListControl: React.FC = () => {
  return (
    <CustomControl
      position="topright"
      style={{ display: 'flex', background: '#fff', padding: '16px' }}
    >
      <div style={{ width: '500px' }}>
        <Form>
          <Form.List name="sights">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} style={{ display: 'flex' }}>
                    <Form.Item
                      name={[name, 'first']}
                      style={{ flex: '1' }}
                      initialValue="and"
                    >
                      <Select placeholder="请选择过滤逻辑">
                        <Option value="and">且</Option>
                        <Option value="or">或</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={[name, 'second']} style={{ flex: '1' }}>
                      <Select placeholder="请选择字段"></Select>
                    </Form.Item>
                    <Form.Item name={[name, 'third']} style={{ flex: '1' }}>
                      <Select placeholder="请选择"></Select>
                    </Form.Item>
                    <Form.Item name={[name, 'fourth']} style={{ flex: '1' }}>
                      <Select placeholder="请选择内容"></Select>
                    </Form.Item>
                    <Button
                      type="link"
                      onClick={() => remove(name)}
                      icon={<CloseOutlined />}
                    />
                  </div>
                ))}
                <Button
                  type="link"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  添加筛选条件
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </CustomControl>
  );
};

export default FilterFormListControl;
