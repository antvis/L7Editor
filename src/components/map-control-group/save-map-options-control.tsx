import { CustomControl, useScene } from '@antv/larkmap';
import { message } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useModel } from 'umi';
import useStyle from './styles';

const SaveMapOptionsControl: React.FC = () => {
  const scene = useScene();
  const styles = useStyle();
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
      <button
        className={classNames([styles.l7ButtonControl, 'l7-button-control'])}
        onClick={onSave}
        type="button"
      >
        <i className="iconfont icon-ditu l7-iconfont"></i>
      </button>
    </CustomControl>
  );
};

export default SaveMapOptionsControl;
