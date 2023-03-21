import { ApiOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import { useModel } from 'umi';
import React, { useState } from 'react';
import { getParamsNew, transformFeatures } from '@/utils';
import { FeatureCollection } from '@turf/turf';
import { FeatureCollectionVT } from '../../../constants/variable-type';

export const UrlBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetFeatures } = useModel('feature');
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

  const getUrlFeatures = async (e: any) => {
    try {
      const json = await fetch(e);
      const fc = (await json.json()) as FeatureCollection;
      if (FeatureCollectionVT.check(fc)) {
        return resetFeatures(fc.features);
      }
    } catch {}
    message.error('url格式错误，仅支持 GeoJSON 格式');
  };

  useMount(async () => {
    const url = getParamsNew('url');
    if (url) {
      getUrlFeatures(url);
    }
  });

  const onFinish = async (e: any) => {
    const { url } = e;
    getUrlFeatures(url);
    handleCancel();
    message.success('导入成功');
  };
  return (
    <>
      <Tooltip overlay="通过 URL 地址导入 GeoJSON" placement="left">
        <Button icon={<ApiOutlined />} onClick={showModal} />
      </Tooltip>

      <Modal
        title="URL"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={{ url: '' }} onFinish={onFinish}>
          <Form.Item
            name="url"
            label="GeoJSON 地址"
            rules={[{ required: true }, { type: 'url' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
