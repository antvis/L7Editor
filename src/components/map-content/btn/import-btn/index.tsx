import { AppEditor } from '@/components/app-editor';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Feature, FeatureCollection } from '@turf/turf';
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
import { useRef, useState } from 'react';
import { useModel } from 'umi';
import { FeatureCollectionVT } from '../../../../constants/variable-type';
import FileUpload from './file-upload';
import LngLatImportBtn from './lnglat-import-btn';
import UrlUpload from './url-upload';

/**
 * Tab类型
 */
type TabType = 'url' | 'file' | 'script' | 'lnglat';
/**
 * 数据类型
 */
type DataType = 'cover' | 'merge';

export const ImportBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetFeatures, features, bboxAutoFit } = useModel('feature');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('url');
  const [selectRadio, setSelectRadio] = useState<DataType>('cover');

  const formRef = useRef<Record<string, any>>(null);

  const items: TabsProps['items'] = [
    {
      key: 'url',
      label: <div>URL上传</div>,
      children: <UrlUpload ref={formRef} />,
    },
    {
      key: 'file',
      label: <div>文件上传</div>,
      children: <FileUpload ref={formRef} />,
    },
    {
      key: 'lnglat',
      label: <div>经纬度上传</div>,
      children: <LngLatImportBtn ref={formRef} />,
    },
    {
      key: 'script',
      label: <div>JavaScript脚本</div>,
      children: (
        <div style={{ width: '100%', height: 300 }}>
          <AppEditor language="javascript" ref={formRef} />
        </div>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectRadio('cover');
  };
  const checkWithRestData = async () => {
    setConfirmLoading(true);
    try {
      const fc = (await formRef.current?.getData()) as FeatureCollection;
      if (FeatureCollectionVT.check(fc)) {
        const newFeatures =
          selectRadio === 'cover' ? fc.features : [...features, ...fc.features];
        resetFeatures(newFeatures as Feature[]);
        bboxAutoFit(newFeatures);
        handleCancel();
      }
    } catch (error) {
      message.error(`${error}`);
    }
    setConfirmLoading(false);
  };
  return (
    <>
      <Tooltip overlay="导入 GeoJSON" placement="left">
        <Button
          icon={<CloudUploadOutlined />}
          onClick={() => setIsModalOpen(true)}
        />
      </Tooltip>

      {isModalOpen && (
        <Modal
          title="上传"
          open={isModalOpen}
          onOk={checkWithRestData}
          onCancel={handleCancel}
          destroyOnClose
          confirmLoading={confirmLoading}
          width={1000}
        >
          <Tabs
            activeKey={activeTab}
            className="map-content__right"
            items={items}
            destroyInactiveTabPane
            onChange={(e) => {
              setActiveTab(e as TabType);
            }}
          />
          <Form.Item
            label="数据操作"
            rules={[{ required: true }]}
            style={{ marginTop: 8 }}
          >
            <Radio.Group
              value={selectRadio}
              onChange={(e) => {
                setSelectRadio(e.target.value);
              }}
            >
              <Radio.Button value="cover">覆盖</Radio.Button>
              <Radio.Button value="merge">追加</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Modal>
      )}
    </>
  );
};