import { AimOutlined } from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import React from 'react';
import { useFeature } from '../../recoil';
import useStyle from './styles';

export const AutoControl = () => {
  const styles = useStyle();
  const { bboxAutoFit } = useFeature();
  return (
    <CustomControl position="bottomright">
      <div className={styles.l7FilterSwitch}>
        <button
          type="button"
          id="l7-editor-driver-auto"
          className="l7-draw-control__btn"
          onClick={() => {
            bboxAutoFit();
          }}
        >
          <AimOutlined />
        </button>
      </div>
    </CustomControl>
  );
};
