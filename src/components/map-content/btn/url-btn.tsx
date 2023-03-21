import { ApiOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import {
  Button,
  Form,
  message,
  Modal,
  Radio,
  Tabs,
  TabsProps,
  Tooltip,
} from 'antd';
import { useModel } from 'umi';
import React, { useRef, useState } from 'react';
import { getParamsNew } from '@/utils';
import { FeatureCollection } from '@turf/turf';
import { FeatureCollectionVT } from '../../../constants/variable-type';
import UrlUpload from '../url-tab-group/url-upload';
import FileUpload from '../url-tab-group/file-upload';
import { isNull } from 'lodash';

export const UrlBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetFeatures, features } = useModel('feature');
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
  const [selectRadio, setSelectRadio] = useState<'cover' | 'merge'>('cover');

  const formRef = useRef<Record<string, any>>(null);
  const items: TabsProps['items'] = [
    {
      key: 'url',
      label: <div>url上传</div>,
      children: <UrlUpload ref={formRef} />,
    },
    {
      key: 'file',
      label: <div>文件上传</div>,
      children: <FileUpload ref={formRef} />,
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectRadio('cover');
  };

  const getUrlFeatures = async (e: any) => {
    try {
      const json = await fetch(e);
      const fc = (await json.json()) as FeatureCollection;
      if (FeatureCollectionVT.check(fc)) {
        return resetFeatures(
          selectRadio === 'cover' ? fc.features : [...features, ...fc.features],
        );
      }
    } catch {
      message.error('url格式错误，仅支持 GeoJSON 格式');
    }
  };

  useMount(async () => {
    const url = getParamsNew('url');
    if (url) {
      getUrlFeatures(url);
    }
  });

  const handleOk = () => {
    if (activeTab === 'file') {
      if (formRef.current) {
        resetFeatures(
          selectRadio === 'cover'
            ? formRef.current.data
            : [...features, ...formRef?.current.data],
        );
      }
      handleCancel();
    }
    const url = form.getFieldValue('url');
    if (activeTab === 'url' && url) {
      getUrlFeatures(url);
      handleCancel();
    }
  };

  return (
    <>
      <Tooltip overlay="通过 URL 地址导入 GeoJSON" placement="left">
        <Button icon={<ApiOutlined />} onClick={showModal} />
      </Tooltip>

      {isModalOpen && (
        <Modal
          title="上传"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form}>
            <Radio.Group
              value={selectRadio}
              onChange={(e) => {
                setSelectRadio(e.target.value);
              }}
            >
              <Radio value="cover">覆盖</Radio>
              <Radio value="merge">合并</Radio>
            </Radio.Group>
            <Tabs
              activeKey={activeTab}
              className="map-content__right"
              items={items}
              onChange={(e) => {
                setActiveTab(e as 'url' | 'file');
              }}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};
