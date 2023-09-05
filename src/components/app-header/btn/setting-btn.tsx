import I18N from '../../../locales';
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
    setCoordConvert,
    showIndex,
    setShowIndex,
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
      <Tooltip title={I18N.t('btn.setting_btn.diTuSheZhi')}>
        <Button
          id="l7-editor-set"
          icon={<SettingOutlined />}
          onClick={showModal}
        >
          {I18N.t('btn.setting_btn.sheZhi')}</Button>
      </Tooltip>
      <Modal
        title={I18N.t('btn.setting_btn.sheZhi')}
        open={isModalOpen}
        onOk={handleOk} /*  */
        onCancel={handleCancel}
        destroyOnClose
        okText={I18N.t('btn.setting_btn.queRen')}
        cancelText={I18N.t('btn.setting_btn.quXiao')}
      >
        <Form
          form={form}
          initialValues={{
            popupTrigger,
            autoFitBounds,
            baseMap,
            showIndex,
          }}
          style={{ textAlign: 'right' }}
          onFinish={(e) => {
            setIsModalOpen(false);
            setPopupTrigger(e.popupTrigger);
            setAutoFitBounds(e.autoFitBounds);
            setCoordConvert(e.baseMap ? 'GCJ02' : 'WGS84');
            setBaseMap(e.baseMap);
            setShowIndex(e.showIndex);
          }}
        >
          <Form.Item name="popupTrigger" label={I18N.t('btn.setting_btn.tuCengQiPaoZhan')}>
            <Radio.Group>
              <Radio.Button value={'click'}>{I18N.t('btn.setting_btn.dianJi')}</Radio.Button>
              <Radio.Button value={'hover'}>{I18N.t('btn.setting_btn.huaRu')}</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="autoFitBounds"
            valuePropName="checked"
            label={I18N.t('btn.setting_btn.ziDongSuoFangZhi')}
          >
            <Switch />
          </Form.Item>

          <Form.Item name="baseMap" label={I18N.t('btn.setting_btn.diTuDiTuQie')}>
            <Radio.Group>
              <Radio.Button value="Gaode">{I18N.t('btn.setting_btn.gaoDe')}</Radio.Button>
              <Radio.Button value="Mapbox">Mapbox</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="showIndex" label={I18N.t('btn.setting_btn.shiFouZhanShiYuan')}>
            <Radio.Group>
              <Radio.Button value={true}>{I18N.t('btn.setting_btn.kaiQi')}</Radio.Button>
              <Radio.Button value={false}>{I18N.t('btn.setting_btn.guanBi')}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
