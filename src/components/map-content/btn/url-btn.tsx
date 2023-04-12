import { AppEditor } from '@/components/app-editor';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Feature } from '@turf/turf';
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
import { FeatureCollectionVT } from '../../../constants/variable-type';
import FileUpload from '../url-tab-group/file-upload';
import UrlUpload from '../url-tab-group/url-upload';
import LngLatImportBtn from './lnglat-import-btn';

/**
 * Tab类型
 */
type TabType = 'url' | 'file' | 'script' | 'lnglat';
/**
 * 数据类型
 */
type DataType = 'cover' | 'merge';

export const UrlBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetFeatures, editorText } = useModel('feature');

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
      key: 'script',
      label: <div>JavaScript脚本</div>,
      children: (
        <div style={{ width: '100%', height: 300 }}>
          <AppEditor language="javascript" ref={formRef} />
        </div>
      ),
    },
    {
      key: 'lnglat',
      label: <div>经纬度上传</div>,
      children: <LngLatImportBtn ref={formRef} />,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectRadio('cover');
  };
  const checkWithRestData = async () => {
    try {
      const newData = await formRef.current?.getData();
      if (FeatureCollectionVT.check(newData)) {
        const featureData =
          selectRadio === 'cover'
            ? newData.features
            : [...JSON.parse(editorText).features, ...newData.features];
        resetFeatures(featureData as Feature[]);
        handleCancel();
      }
    } catch (error) {
      message.error(`${error}`);
    }
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
