import { CustomControl } from '@antv/larkmap';
import { Popconfirm, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconFont } from '../../../constants';
import { useFeature } from '../../../recoil';
import { prettierText } from '../../../utils/prettier-text';
import useStyle from './styles';

export const ClearControl = () => {
  const styles = useStyle();
  const { saveEditorText } = useFeature();
  const { t } = useTranslation();

  return (
    <>
      <CustomControl position="topright">
        <Popconfirm
          title={t('clear_control.index.queRenQingKongSuo')}
          onConfirm={() => {
            saveEditorText(
              prettierText({
                content: { type: 'FeatureCollection', features: [] },
              }),
            );
          }}
        >
          <Tooltip title={t('app_header.constants.qingChu')} placement="bottom">
            <div className={styles.clear} id="l7-editor-clear">
              <IconFont style={{color:'#000'}} type="icon-qingkong" className={styles.clearSvg} />
            </div>
          </Tooltip>
        </Popconfirm>
      </CustomControl>
    </>
  );
};
