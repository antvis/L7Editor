import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';

export default () => {
  const onHandback = () => {
    window.open(
      'https://www.yuque.com/antv/l7/buhith8khkc9mfsg?singleDoc#',
      '_blank',
    );
  };
  return (
    <Tooltip title="帮助文档">
      <Button icon={<QuestionCircleOutlined />} onClick={onHandback}>
        帮助
      </Button>
    </Tooltip>
  );
};
