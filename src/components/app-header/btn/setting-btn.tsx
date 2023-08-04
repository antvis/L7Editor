//@ts-ignore
import { useGlobal } from '@/recoil';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';

export const SettingBtn = () => {
  const { baseMap, setBaseMap } = useGlobal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { popupTrigger, setPopupTrigger, autoFitBounds, setAutoFitBounds } =
    useGlobal();

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
        <Button id='l7-editor-driver-set' icon={<SettingOutlined />} onClick={showModal}>
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
          initialValues={{ popupTrigger, autoFitBounds, baseMap }}
          style={{ textAlign: 'right' }}
          onFinish={(e) => {
            setIsModalOpen(false);
            setPopupTrigger(e.popupTrigger);
            setAutoFitBounds(e.autoFitBounds);
            setBaseMap(e.baseMap);
            window.location.reload();
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
        </Form>
      </Modal>
    </>
  );
};
