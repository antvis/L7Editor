import { CloudUploadOutlined } from '@ant-design/icons';
import type { FeatureCollection } from '@turf/turf';
import type { TabsProps } from 'antd';
import { Button, Form, message, Modal, Radio, Tabs, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoJsonEditor } from '../../../../components/geojson-editor';
import { FeatureCollectionVT } from '../../../../constants/variable-type';
import { useFeature } from '../../../../recoil';
import type { IFeatures } from '../../../../types';
import FileUpload from './file-upload';
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
  const { resetFeatures, features, bboxAutoFit } = useFeature();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('file');
  const [selectRadio, setSelectRadio] = useState<DataType>('cover');
  const formRef = useRef<Record<string, any>>(null);
  const { t } = useTranslation();
  const items: TabsProps['items'] = [
    {
      key: 'file',
      label: <div>{t('import_btn.file_upload.wenJianShangChuan')}</div>,
      children: <FileUpload ref={formRef} />,
    },
    {
      key: 'url',
      label: <div>{t('import_btn.index.uRLShangChuan')}</div>,
      children: <UrlUpload ref={formRef} />,
    },
    // {
    //   key: 'lngLatUpload',
    //   label: <div>经纬度上传</div>,
    //   children: <LngLatImportBtn ref={formRef} />,
    // },
    {
      key: 'script',
      label: <div>{t('import_btn.index.jAVAS')}</div>,
      children: (
        <div style={{ width: '100%', height: 300 }}>
          <GeoJsonEditor language="javascript" ref={formRef} />
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
        resetFeatures(newFeatures as IFeatures);
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
      <Tooltip title={t('import_btn.index.shangChuanShuJu')} placement='bottom'>
        <Button
          icon={<CloudUploadOutlined />}
          onClick={() => setIsModalOpen(true)}
          id="l7-editor-upload"
        >
          {t('import_btn.index.shangChuan')}
        </Button>
      </Tooltip>

      {isModalOpen && (
        <Modal
          title={t('import_btn.index.shangChuan')}
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
            label={t('import_btn.index.shuJuCaoZuo')}
            rules={[{ required: true }]}
            style={{ marginTop: 8 }}
          >
            <Radio.Group
              value={selectRadio}
              onChange={(e) => {
                setSelectRadio(e.target.value);
              }}
            >
              <Radio.Button value="cover">
                {t('import_btn.index.fuGai')}
              </Radio.Button>
              <Radio.Button value="merge">
                {t('import_btn.index.zhuiJia')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Modal>
      )}
    </>
  );
};
