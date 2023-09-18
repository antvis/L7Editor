import { CustomControl } from '@antv/larkmap';
import { Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconFont } from '../../../constants';
import { useFeature } from '../../../recoil';
import useStyle from './styles';

export const AutoControl = () => {
  const styles = useStyle();
  const { bboxAutoFit } = useFeature();
  const { t } = useTranslation();

  return (
    <CustomControl position="bottomright">
      <div className={styles.l7FilterSwitch}>
        <Tooltip
          title={t('auto_control.index.ziDongSuoFangZhi')}
          placement="left"
        >
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
        </Tooltip>
      </div>
    </CustomControl>
  );
};
