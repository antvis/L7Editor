import { CustomControl } from '@antv/larkmap';
import { Popover } from 'antd';
import React from 'react';
import { SketchPicker } from 'react-color';
import { useModel } from 'umi';
import './index.less';

const LayerColorControl: React.FC = () => {
  const { layerColor, setLayerColor } = useModel('global');

  return (
    <CustomControl className="l7-button-control" position="bottomright">
      <Popover
        trigger="click"
        overlayClassName="color-picker-control__tooltip"
        placement="bottomRight"
        content={
          <SketchPicker
            color={layerColor}
            onChange={({ rgb }) => {
              const { r, g, b, a } = rgb;
              setLayerColor(`rgba(${[r, g, b, a].join(', ')})`);
            }}
          />
        }
      >
        <div
          className="color-picker-control__inner"
          style={{ backgroundColor: layerColor }}
        ></div>
      </Popover>
    </CustomControl>
  );
};

export default LayerColorControl;
