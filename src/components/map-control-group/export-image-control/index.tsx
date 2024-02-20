import { ExportImageControl } from '@antv/larkmap';
import { Image, Modal } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadImg } from '.././../../utils';
import useStyle from './styles';

export const ExportImage = () => {
  const styles = useStyle();
  const [imageData, setImageData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const onExport = (value: string) => {
    setIsModalOpen(true);
    setImageData(value);
  };

  const handle = () => {
    setIsModalOpen(false);
    setImageData('');
  };

  const onOk = () => {
    setIsModalOpen(false);
    downloadImg(imageData);
    setImageData('');
  };
  return (
    <>
      <ExportImageControl
        onExport={onExport}
        className={styles.l7ExportImg}
        imageType="jpeg"
        position={'bottomright'}
      />
      <Modal
        title={t('export-img-control_title')}
        open={isModalOpen}
        okText={t('btn.download_btn.xiaZai')}
        onOk={onOk}
        onCancel={handle}
      >
        <Image src={imageData} />
      </Modal>
    </>
  );
};
