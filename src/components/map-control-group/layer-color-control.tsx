import { CustomControl } from '@antv/larkmap';
import { ColorPicker } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useGlobal } from '../../recoil';
import useStyle from './styles';

const LayerColorControl: React.FC = () => {
  const { layerColor, setLayerColor } = useGlobal();
  const styles = useStyle();

  return (
    <CustomControl position="bottomright">
      <div id="l7-editor-color">
        <ColorPicker
          value={layerColor}
          className={classNames([styles.l7ButtonControl])}
          onChange={(value, hex) => {
            setLayerColor(hex);
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
      </div>
    </CustomControl>
  );
};

export default LayerColorControl;
