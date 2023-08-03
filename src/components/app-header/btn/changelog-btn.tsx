import { AuditOutlined } from '@ant-design/icons';
import { Button, Modal, Timeline, Tooltip } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [showModal, setShowModal] = useState(false);
  const logs = [
    {
      label: '2023-05-12',
      children: '设置中增加mapbox底图',
    },
    {
      label: '2023-05-31',
      children: '添加谷歌卫星遥感图层',
    },
  ];
  return (
    <div>
      <Tooltip title="更新日志">
        <Button icon={<AuditOutlined />} onClick={() => setShowModal(true)}>
          更新日志
        </Button>
      </Tooltip>
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
    </div>
  );
};
