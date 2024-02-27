import { CustomControl, useScene } from '@antv/larkmap';
import { Button, Input, Modal, Tooltip, message } from 'antd';
import Clipboard from 'clipboard';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconFont } from '../../../components/iconfont';
import useStyles from '../styles';

const { TextArea } = Input;

export const GetOptionControl = () => {
  const scene = useScene();
  const styles = useStyles();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
    const optionJson = {
      center: [scene.getCenter().lng, scene.getCenter().lat],
      zoom: scene.getZoom(),
      pitch: scene.getPitch(),
      rotation: scene.getRotation(),
    };
    setTextValue(JSON.stringify(optionJson));
  };

  const handleOk = () => {
    const clipboard = new Clipboard(`#l7-option-copy_btn`, {
      text: () => textValue,
    });

    clipboard.on('success', () => {
      setIsModalOpen(false);
      message.success(t('layer_contextmenu_popup.fuZhiChengGong'));
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <CustomControl position="bottomleft">
      <Tooltip placement="left" overlay={t('l7Options.huoqucanshu')}>
        <button
          className={styles.L7EditorControl}
          id="text-layer-control"
          onClick={showModal}
        >
          <IconFont type="icon-xitongzhuangtai" />
        </button>
      </Tooltip>
      <Modal
        title={t('l7Options.dangqiancanshu')}
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={
          <>
            <Button onClick={handleCancel}>
              {t('btn.setting_btn.guanBi')}
            </Button>
            <Button type="primary" id="l7-option-copy_btn" onClick={handleOk}>
              {t('layer_contextmenu_popup.fuZhi')}
            </Button>
          </>
        }
      >
        <TextArea
          rows={4}
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
        />
      </Modal>
    </CustomControl>
  );
};
