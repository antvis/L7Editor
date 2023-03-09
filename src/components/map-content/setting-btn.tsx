import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, RadioChangeEvent } from 'antd';
import { useModel } from 'umi';

export const SettingBtn = () => {
  const { popupTrigger, setPopupTrigger } = useModel('global');
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
          initialValues={{ popup: popupTrigger }}
          onFinish={(e) => {
            setIsModalOpen(false);
            setPopupTrigger(e.popup);
          }}
        >
          <Form.Item name="popup" label="图层气泡展示方式">
            <Radio.Group>
              <Radio.Button value={'click'}>点击</Radio.Button>
              <Radio.Button value={'hover'}>划入</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
