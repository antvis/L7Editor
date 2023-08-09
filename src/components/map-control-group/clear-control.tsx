import { ClearOutlined } from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import { Popconfirm } from 'antd';
import React from 'react';
import { useFeature } from '../../recoil';
import { prettierText } from '../../utils/prettier-text';
import useStyle from './styles';

export const ClearControl = () => {
  const styles = useStyle();
  const { saveEditorText } = useFeature();
  return (
    <>
      <CustomControl position="topright">
        <Popconfirm
          title="确认清空所有数据？"
          onConfirm={() => {
            saveEditorText(
              prettierText({
                content: { type: 'FeatureCollection', features: [] },
              }),
            );
          }}
        >
          <div className={styles.clear} id="l7-editor-driver-clear">
            <ClearOutlined className={styles.clearSvg} />
          </div>
        </Popconfirm>
      </CustomControl>
    </>
  );
};
