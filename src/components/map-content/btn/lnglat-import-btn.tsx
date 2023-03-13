import React, { useState } from 'react';
import { Button, Input, message, Modal, Radio, Tooltip } from 'antd';
import { LngLatImportType } from '@/types';
import { useModel } from 'umi';

const LngLatImportTypeOptions: Array<{
  label: string;
  value: LngLatImportType;
}> = [
  {
    label: '点',
    value: 'Point',
  },
  {
    label: '线',
    value: 'LingString',
  },
  {
    label: '面',
    value: 'Polygon',
  },
];

const LngLatImportBtn: React.FC = () => {
  const {
    lngLatImportType,
    lngLatText,
    setLngLatImportType,
    setLngLatText,
    importLngLatText,
  } = useModel('lnglat');
  const [visible, setVisible] = useState(false);

  const onSubmit = () => {
    try {
      importLngLatText(lngLatText);
      message.success('LngLat 导入成功');
      setVisible(false);
    } catch (e) {
      message.error('LngLat 导入失败');
    }
  };

  return (
    <>
      <Tooltip overlay="导入经纬度串" placement="left">
        <Button icon="L" onClick={() => setVisible(true)} />
      </Tooltip>
      <Modal
        title="导入纬度串"
        open={visible}
        okButtonProps={{
          disabled: !lngLatText,
        }}
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
      >
        <Radio.Group
          value={lngLatImportType}
          buttonStyle="solid"
          onChange={(e) => {
            setLngLatImportType(e.target.value);
          }}
        >
          {LngLatImportTypeOptions.map((item) => (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>

        <Input.TextArea
          style={{ marginTop: 16 }}
          placeholder="请输入连续的经纬度并用符号隔开，例如：120.85,30.26;130.85,31.21"
          value={lngLatText}
          rows={10}
          onChange={(e) => {
            setLngLatText(e.target.value);
          }}
        />
      </Modal>
    </>
  );
};

export default LngLatImportBtn;
