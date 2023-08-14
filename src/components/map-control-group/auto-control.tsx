import { CustomControl } from '@antv/larkmap';
import React from 'react';
import { IconFont } from '../../constants';
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
          id="l7-editor-auto"
          className="l7-draw-control__btn"
          onClick={() => {
            bboxAutoFit();
          }}
        >
          <IconFont type="icon-suofang" className={styles.l7AmapControl} />
        </button>
      </div>
    </CustomControl>
  );
};
