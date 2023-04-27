import { CustomControl, useScene } from '@antv/larkmap';
import { message, Tooltip } from 'antd';
import React from 'react';
import { useModel } from 'umi';

const SaveMapOptionsControl: React.FC = () => {
  const scene = useScene();
  const { setMapOptions } = useModel('global');
  const onSave = () => {
    const { lng, lat } = scene.getCenter();
    setMapOptions((oldMapOptions) => {
      return {
        ...oldMapOptions,
        center: [lng, lat],
        zoom: scene.getZoom(),
      };
    });
    message.success('地图状态保存成功 ');
  };

  return (
    <CustomControl position="bottomright">
      <Tooltip overlay="保存地图状态" placement="right">
        <button type="button" className="l7-button-control" onClick={onSave}>
          <i className="iconfont icon-ditu l7-iconfont"></i>
        </button>
      </Tooltip>
    </CustomControl>
  );
};

export default SaveMapOptionsControl;
