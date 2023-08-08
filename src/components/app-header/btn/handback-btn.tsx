import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Modal, Timeline } from 'antd';
import React, { useState } from 'react';
import { dingGroupImg } from '../../../constants';
import { HandBackMenuItems, logs } from '../constants';

export default () => {
  const [showModal, setShowModal] = useState(false);
  const [dingModal, setDingModal] = useState(false);

  const onDownload = (key: string) => {
    if (key === 'text') {
      window.open(
        'https://www.yuque.com/antv/l7/buhith8khkc9mfsg?singleDoc#',
        '_blank',
      );
    } else if (key === 'api') {
      window.open('/text');
    } else if (key === 'changeLog') {
      setShowModal(true);
    } else if (key === 'ding') {
      setDingModal(true);
    }
  };
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
        <Button icon={<QuestionCircleOutlined />}>帮助</Button>
      </Dropdown>
      <Modal
        title="更新日志"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Timeline mode="left">
          {logs.map((item) => (
            <Timeline.Item key={item.label} label={item.label}>
              {item.children}
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>
      <Modal
        title="联系方式"
        open={dingModal}
        onCancel={() => setDingModal(false)}
        footer={null}
      >
        <img style={{ width: 400 }} src={dingGroupImg} />
      </Modal>
    </>
  );
};
