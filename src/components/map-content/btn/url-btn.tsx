import { ApiOutlined, UploadOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Tabs,
  TabsProps,
  Tooltip,
  Upload,
} from 'antd';
import { useModel } from 'umi';
import React, { useState } from 'react';
import { getParamsNew, transformFeatures } from '@/utils';
import { FeatureCollection } from '@turf/turf';
import { FeatureCollectionVT } from '../../../constants/variable-type';

export const UrlBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetFeatures } = useModel('feature');
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState<'upload' | 'file'>('upload');

  const items: TabsProps['items'] = [
    {
      key: 'upload',
      label: <div>url上传</div>,
      children: (
        <Form.Item
          name="url"
          label="GeoJSON 地址"
          rules={[{ required: true }, { type: 'url' }]}
          style={{ marginTop: 16 }}
        >
          <Input placeholder="https://..." />
        </Form.Item>
      ),
    },
    {
      key: 'file',
      label: <div>文件上传</div>,
      children: (
        <Form.Item
          name="file"
          label="文件上传"
          rules={[{ required: true }]}
          style={{ marginTop: 16 }}
        >
          <Upload accept=".json,.csv" customRequest={() => {}}>
            <Button icon={<UploadOutlined />}>文件上传</Button>
          </Upload>
        </Form.Item>
      ),
    },
  ];

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
          <Tabs
            activeKey={activeTab}
            className="map-content__right"
            items={items}
            onChange={(e) => {
              setActiveTab(e as 'upload' | 'file');
            }}
          />
        </Form>
      </Modal>
    </>
  );
};
