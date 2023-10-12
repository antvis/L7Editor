import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    setMapOptions,
    showIndex,
    setShowIndex,
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
      <Tooltip title={t('btn.setting_btn.diTuSheZhi')}>
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
            baseMap,
            showIndex,
          }}
          style={{ textAlign: 'right' }}
          onFinish={(e) => {
            setIsModalOpen(false);
            setPopupTrigger(e.popupTrigger);
            setAutoFitBounds(e.autoFitBounds);
            setCoordConvert(e.baseMap === 'Gaode' ? 'GCJ02' : 'WGS84');
            setMapOptions((options) => {
              return {
                ...options,
                style: e.baseMap === 'Gaode' ? 'normal' : 'mapbox://styles/zcxduo/ck2ypyb1r3q9o1co1766dex29'
              };
            });
            setBaseMap(e.baseMap);
            setShowIndex(e.showIndex);
            location.reload();
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

          <Form.Item name="baseMap" label={t('btn.setting_btn.diTuDiTuQie')}>
            <Radio.Group>
              <Radio.Button value="Gaode">
                {t('btn.setting_btn.gaoDe')}
              </Radio.Button>
              <Radio.Button value="Mapbox">Mapbox</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="showIndex"
            label={t('btn.setting_btn.shiFouZhanShiYuan')}
          >
            <Radio.Group>
              <Radio.Button value={true}>
                {t('btn.setting_btn.kaiQi')}
              </Radio.Button>
              <Radio.Button value={false}>
                {t('btn.setting_btn.guanBi')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
