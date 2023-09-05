import I18N from '@/locales';
import { CustomControl } from '@antv/larkmap';
import { Popconfirm, Tooltip } from 'antd';
import React from 'react';
import { IconFont } from '../../../constants';
import { useFeature } from '../../../recoil';
import { prettierText } from '../../../utils/prettier-text';
import useStyle from './styles';

export const ClearControl = () => {
  const styles = useStyle();
  const { saveEditorText } = useFeature();
  return (
    <>
      <CustomControl position="topright">
        <Popconfirm
          title={I18N.t('clear_control.index.queRenQingKongSuo')}
          onConfirm={() => {
            saveEditorText(
              prettierText({
                content: { type: 'FeatureCollection', features: [] },
              }),
            );
          }}
        >
          <Tooltip title={I18N.t('app_header.constants.qingChu')} placement="bottom">
            <div className={styles.clear} id="l7-editor-clear">
              <IconFont type="icon-qingkong" className={styles.clearSvg} />
            </div>
          </Tooltip>
        </Popconfirm>
      </CustomControl>
    </>
  );
};
