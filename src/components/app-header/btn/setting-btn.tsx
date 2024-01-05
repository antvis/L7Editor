import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from '../../../recoil';

export const SettingBtn: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    popupTrigger,
    setPopupTrigger,
    autoFitBounds,
    setAutoFitBounds,
    distanceDisplay,
    setDistanceDisplay,
    areaDisplay,
    setAreaDisplay,
  } = useGlobal();
  const { t } = useTranslation();
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
      <Tooltip title={t('btn.setting_btn.diTuSheZhi')} placement="bottom">
        <Button
          id="l7-editor-set"
          icon={<SettingOutlined />}
          onClick={showModal}
        >
          {t('btn.setting_btn.sheZhi')}
        </Button>
      </Tooltip>
      <Modal
        title={t('btn.setting_btn.sheZhi')}
        open={isModalOpen}
        onOk={handleOk} /*  */
        onCancel={handleCancel}
        destroyOnClose
        okText={t('btn.setting_btn.queRen')}
        cancelText={t('btn.setting_btn.quXiao')}
      >
        <Form
          form={form}
          initialValues={{
            popupTrigger,
            autoFitBounds,
            distanceDisplay,
            areaDisplay,
          }}
          style={{ textAlign: 'right' }}
          onFinish={(e) => {
            setIsModalOpen(false);
            setPopupTrigger(e.popupTrigger);
            setAutoFitBounds(e.autoFitBounds);
            setDistanceDisplay(e.distanceDisplay);
            setAreaDisplay(e.areaDisplay);
          }}
        >
          <Form.Item
            name="popupTrigger"
            label={t('btn.setting_btn.tuCengQiPaoZhan')}
          >
            <Radio.Group>
              <Radio.Button value={'click'}>
                {t('btn.setting_btn.dianJi')}
              </Radio.Button>
              <Radio.Button value={'hover'}>
                {t('btn.setting_btn.huaRu')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="autoFitBounds"
            valuePropName="checked"
            label={t('btn.setting_btn.ziDongSuoFangZhi')}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="distanceDisplay"
            valuePropName="checked"
            label={t('btn.setting_btn.juLi')}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="areaDisplay"
            valuePropName="checked"
            label={t('btn.setting_btn.mianJi')}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
