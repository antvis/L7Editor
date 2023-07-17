import { useGlobal } from '@/recoil';
import { CustomControl } from '@antv/larkmap';
import { ColorPicker } from 'antd';
import React from 'react';
import './index.less';

const LayerColorControl: React.FC = () => {
  const { layerColor, setLayerColor } = useGlobal();

  return (
    <CustomControl position="bottomright">
      <ColorPicker value={layerColor}
        className="l7-color-control"
        onChange={(value, hex) => {
          setLayerColor(hex)
        }}
      />
    </CustomControl>
  );
};

export default LayerColorControl;
