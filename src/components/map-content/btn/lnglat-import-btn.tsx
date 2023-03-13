import React, { useState } from 'react';
import { Button, Input, message, Modal, Radio, Tooltip } from 'antd';
import { LngLatImportType } from '@/types';
import { useModel } from 'umi';

const LngLatImportTypeOptions: Array<{
  label: string;
  value: LngLatImportType;
  placeholder: string;
}> = [
  {
    label: '点',
    value: 'Point',
    placeholder:
      '请输入连续的点经纬度，经度和纬度之间用","隔开，不同经纬度点之间用";"隔开，例如：\n120.85,30.26;130.85,31.21',
  },
  {
    label: '线',
    value: 'LingString',
    placeholder:
      '请输入连续的线经纬度，经度和纬度之间用","隔开，不同经纬度点之间用";"隔开，不同的线之间用"\\n"隔开，例如：\n120.85,30.26;130.85,31.21\n121.31,30.21;126,21',
  },
  {
    label: '面',
    value: 'Polygon',
    placeholder:
      '请输入连续的面经纬度，经度和纬度之间用","隔开，不同经纬度点之间用";"隔开，不同的面之间用"\\n"隔开，例如：\n120.85,30.26;130.85,31.21;121.85,23.85;120.85,30.26\n122.82,10.12;121.23,12.45;100.12,23.12;122.82,10.12',
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
        title="导入经纬度串"
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
          placeholder={
            LngLatImportTypeOptions.find(
              (item) => item.value === lngLatImportType,
            )?.placeholder
          }
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
