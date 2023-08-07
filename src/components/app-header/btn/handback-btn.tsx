import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';

export default () => {
  const DownloadMenuItems: MenuProps['items'] = [
    {
      key: 'text',
      label: '平台文档',
    },
    {
      key: 'api',
      label: '组件API文档',
    },
  ];

  const onDownload = (key: string) => {
    if (key === 'text') {
      window.open(
        'https://www.yuque.com/antv/l7/buhith8khkc9mfsg?singleDoc#',
        '_blank',
      );
    } else if (key === 'api') {
      window.open('/text');
    }
  };
  return (
    <Dropdown
      menu={{
        items: DownloadMenuItems,
        onClick: ({ key }) => {
          onDownload(key);
        },
      }}
    >
      <Button icon={<QuestionCircleOutlined />}>帮助</Button>
    </Dropdown>
  );
};
