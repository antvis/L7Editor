import { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, Switch } from 'antd';
import { useModel } from 'umi';

export const SettingBtn = () => {
  const { popupTrigger, setPopupTrigger, autoFitBounds, setAutoFitBounds } =
    useModel('global');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={showModal}></Button>
      <Modal
        title="设置"
        open={isModalOpen}
        onOk={handleOk} /*  */
        onCancel={handleCancel}
        destroyOnClose
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={form}
          initialValues={{ popupTrigger, autoFitBounds }}
          style={{ textAlign: 'right' }}
          onFinish={(e) => {
            setIsModalOpen(false);
            setPopupTrigger(e.popupTrigger);
            setAutoFitBounds(e.autoFitBounds);
          }}
        >
          <Form.Item name="popupTrigger" label="图层气泡展示方式">
            <Radio.Group>
              <Radio.Button value={'click'}>点击</Radio.Button>
              <Radio.Button value={'hover'}>划入</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="autoFitBounds"
            valuePropName="checked"
            label="自动缩放至所有元素可见"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
