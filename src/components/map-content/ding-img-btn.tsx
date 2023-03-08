import { dingGroupImg } from '@/constants';
import { DingdingOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React from 'react';

interface IProps {}

const DingImgBtn: React.FC<IProps> = () => {
  return (
    <Popover
      overlayStyle={{ padding: 0 }}
      content={<img style={{ width: 400 }} src={dingGroupImg} />}
    >
      <Button icon={<DingdingOutlined />}></Button>
    </Popover>
  );
};

export default DingImgBtn;
