import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Modal } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dingGroupImg } from '../../../constants';

export default () => {
  const [dingModal, setDingModal] = useState(false);
  const { t } = useTranslation();
  const onDownload = (key: string) => {
    if (key === 'text') {
      window.open(
        'https://www.yuque.com/antv/l7/buhith8khkc9mfsg?singleDoc#',
        '_blank',
      );
    } else if (key === 'api') {
      window.open('/docs');
    } else if (key === 'ding') {
      setDingModal(true);
    }
  };

  const HandBackMenuItems: MenuProps['items'] = [
    {
      key: 'text',
      label: t('app_header.constants.pingTaiShiYongWen'),
    },
    {
      key: 'api',
      label: t('app_header.constants.zuJianAPI'),
    },
    {
      key: 'ding',
      label: t('btn.handback_btn.lianXiWoMen'),
    },
  ];
  return (
    <>
      <Dropdown
        menu={{
          items: HandBackMenuItems,
          onClick: ({ key }) => {
            onDownload(key);
          },
        }}
      >
        <Button icon={<QuestionCircleOutlined />}>
          {t('btn.handback_btn.bangZhu')}
        </Button>
      </Dropdown>
      <Modal
        title={t('btn.handback_btn.lianXiWoMen')}
        open={dingModal}
        onCancel={() => setDingModal(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <img style={{ width: 400 }} src={dingGroupImg} />
        </div>
      </Modal>
    </>
  );
};
