import { dingGroupImg } from '@/constants';
import { DingdingOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React from 'react';

interface IProps {}

const DingImgBtn: React.FC<IProps> = () => {
  return (
    <Popover
      overlayStyle={{ padding: 0 }}
      title={'使用 L7Editor 有任何疑问或需求环境加群咨询'}
      content={<img style={{ width: 400 }} src={dingGroupImg} />}
    >
      <Button icon={<DingdingOutlined />}></Button>
    </Popover>
  );
};

export default DingImgBtn;
