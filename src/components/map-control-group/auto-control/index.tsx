import { CustomControl } from '@antv/larkmap';
import { Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconFont } from '../../iconfont';
import { useFeature } from '../../../recoil';
import useStyles from '../styles';

export const AutoControl = () => {
  const styles = useStyles();
  const { bboxAutoFit } = useFeature();
  const { t } = useTranslation();

  return (
    <CustomControl position="bottomright">
        <Tooltip
          title={t('auto_control.index.ziDongSuoFangZhi')}
          placement="left"
        >
          <button
            type="button"
            id="l7-editor-auto"
            className={styles.L7EditorControl}
            onClick={() => {
              bboxAutoFit();
            }}
          >
            <IconFont type="icon-suofang" className={styles.l7EditorIcon} />
          </button>
        </Tooltip>
    </CustomControl>
  );
};
