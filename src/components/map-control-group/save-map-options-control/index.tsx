import { CustomControl, useScene } from '@antv/larkmap';
import { message, Tooltip } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useGlobal } from '../../../recoil';
import useStyle from './styles';

const SaveMapOptionsControl: React.FC = () => {
  const scene = useScene();
  const styles = useStyle();
  const { setMapOptions } = useGlobal();
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
        <button
          className={classNames([styles.l7ButtonControl, 'l7-button-control'])}
          onClick={onSave}
          type="button"
        >
          <i className="iconfont icon-ditu l7-iconfont"></i>
        </button>
      </Tooltip>
    </CustomControl>
  );
};

export default SaveMapOptionsControl;
