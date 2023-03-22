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
import { getParamsNew, isPromise, transformFeatures } from '@/utils';
import React, { useRef, useState } from 'react';
import { FeatureCollection } from '@turf/turf';
import { FeatureCollectionVT } from '../../../constants/variable-type';
import UrlUpload from '../url-tab-group/url-upload';
import FileUpload from '../url-tab-group/file-upload';
import { AppEditor } from '@/components/app-editor';

type TabType = 'upload' | 'file' | 'script';
export const UrlBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const { resetFeatures, features } = useModel('feature');
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'script'>('url');
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
    {
      key: 'script',
      label: <div>javascript脚本</div>,
      children: (
        <div style={{ width: '100%', height: 400 }}>
          <AppEditor
            language="javascript"
            onChange={(content) => setScriptContent(content)}
          />
        </div>
      ),
    },
    // {
    //   key: 'script',
    //   label: <div>javascript脚本</div>,
    //   children: (
    //     <div style={{ width: '100%', height: 400 }}>
    //       <AppEditor
    //         language="javascript"
    //         onChange={(content) => setScriptContent(content)}
    //       />
    //     </div>
    //   ),
    // },
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
      if (activeTab === 'script') {
        let geoData;
        const funcResult = new Function(scriptContent);
        if (funcResult()) {
          geoData = funcResult();
        } else {
          const evalResult = eval(scriptContent);
          geoData = isPromise(evalResult) ? await evalResult : evalResult;
        }
        if (FeatureCollectionVT.check(geoData)) {
          return resetFeatures(geoData.features);
        }
        return;
      }
      const json = await fetch(e);
      const fc = (await json.json()) as FeatureCollection;
      if (FeatureCollectionVT.check(fc)) {
        return resetFeatures(
          selectRadio === 'cover' ? fc.features : [...features, ...fc.features],
        );
      }
    } catch (error) {
      message.error(`${error}`);
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
        const isErrorList = form
          .getFieldValue('file')
          .fileList.filter((item: any) => item.status === 'error');
        if (!!isErrorList.length) {
          return;
        }
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
          width={activeTab === 'script' ? 1000 : 600}
        >
          <Form form={form}>
            <Form.Item label="数据操作">
              <Radio.Group
                value={selectRadio}
                onChange={(e) => {
                  setSelectRadio(e.target.value);
                }}
              >
                <Radio.Button value="cover">覆盖</Radio.Button>
                <Radio.Button value="merge">合并</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Tabs
              activeKey={activeTab}
              className="map-content__right"
              items={items}
              onChange={(e) => {
                setActiveTab(e as 'url' | 'file' | 'script');
              }}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};
