import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useGlobal } from '../../../recoil';

export const SettingBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    baseMap,
    setBaseMap,
    popupTrigger,
    setPopupTrigger,
    autoFitBounds,
    setAutoFitBounds,
    coordConvert,
    setConvert,
  } = useGlobal();

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
      <Tooltip title="地图设置">
        <Button
          id="l7-editor-driver-set"
          icon={<SettingOutlined />}
          onClick={showModal}
        >
          设置
        </Button>
      </Tooltip>
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
          initialValues={{
            popupTrigger,
            autoFitBounds,
            baseMap,
            convertData: coordConvert,
          }}
          style={{ textAlign: 'right' }}
          onFinish={(e) => {
            setIsModalOpen(false);
            setPopupTrigger(e.popupTrigger);
            setAutoFitBounds(e.autoFitBounds);
            setConvert(e.convertData);
            setBaseMap(e.baseMap);
            window.location.reload();
          }}
          onValuesChange={(e) => {
            if (e?.baseMap === 'Gaode') {
              form.setFieldValue('convertData', 'GCJ02');
            } else {
              form.setFieldValue('convertData', 'WGS84');
            }
            if (e.convertData) {
              form.setFieldValue('convertData', e.convertData);
            }
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

          <Form.Item name="baseMap" label="地图底图切换">
            <Radio.Group>
              <Radio.Button value="Gaode">高德</Radio.Button>
              <Radio.Button value="Mapbox">Mapbox</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="convertData" label="经纬度坐标系">
            <Radio.Group>
              <Radio.Button value="GCJ02">GCJ02</Radio.Button>
              <Radio.Button value="WGS84">WGS84</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
