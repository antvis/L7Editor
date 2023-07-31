import { useGlobal } from '@/recoil';
import { CustomControl } from '@antv/larkmap';
import { ColorPicker } from 'antd';
import React from 'react';
import useStyle from './styles';
import classNames from 'classnames';

const LayerColorControl: React.FC = () => {
  const { layerColor, setLayerColor } = useGlobal();
  const styles = useStyle();

  return (
    <CustomControl position="bottomright" >
      <ColorPicker value={layerColor}
        className={classNames([styles.l7ButtonControl])}
        onChange={(value, hex) => {
          setLayerColor(hex)
        }}
        format="rgb"
        presets={[
          {
            label: '常用颜色',
            colors: [
              '#F5222D',
              '#FA8C16',
              '#FADB14',
              '#8BBB11',
              '#52C41A',
              '#13A8A8',
              '#1677FF',
              '#2F54EB',
              '#722ED1',
              '#EB2F96',
            ],
          },
        ]}
      />
    </CustomControl>
  );
};

export default LayerColorControl;
