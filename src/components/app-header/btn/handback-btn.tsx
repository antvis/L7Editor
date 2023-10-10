import { QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const onDownload = (key: string) => {
    if (key === 'guide') {
      window.open('/guide');
    } else if (key === 'api') {
      window.open('/docs');
    }
  };

  const HandBackMenuItems: MenuProps['items'] = [
    {
      key: 'guide',
      label: t('app_header.constants.pingTaiShiYongWen'),
    },
    {
      key: 'api',
      label: t('app_header.constants.zuJianAPI'),
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
    </>
  );
};
