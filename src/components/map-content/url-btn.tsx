import { ApiOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Form, Input, message, Modal } from 'antd';
import { useModel } from 'umi';
import React, { useState } from 'react';

export const UrlBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setEditorText } = useModel('feature');
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getParamsNew = (key: string) => {
    const temData = new URLSearchParams(window.location.search);
    return temData.get(key);
  };

  useMount(async () => {
    if (getParamsNew('url')) {
      try {
        const json = await fetch(getParamsNew('url'));
        const data = await json.json();
        setEditorText(JSON.stringify(data, null, 2));
      } catch {
        message.error('url格式错误');
      }
    }
  });

  const onFinish = async (e: any) => {
    console.log(e);
    const { url } = e;

    try {
      const json = await fetch(url);
      const data = await json.json();
      setEditorText(JSON.stringify(data, null, 2));
      setIsModalOpen(false);
    } catch {
      message.error('url格式错误');
    }
  };
  return (
    <>
      <Button icon={<ApiOutlined />} onClick={showModal} />
      <Modal
        title="URL"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={{ url: '' }} onFinish={onFinish}>
          <Form.Item name="url" label="url">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
