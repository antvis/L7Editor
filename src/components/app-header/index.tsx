//@ts-ignore
import { useFeature, useGlobal } from '@/recoil';
import { ClearOutlined, SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Popconfirm } from 'antd';
import React, { useMemo } from 'react';
import { IconFont } from '../../constants';
import { prettierText } from '../../utils/prettier-text';
import ChangeLog from './btn/changelog-btn';
import DingImgBtn from './btn/ding-img-btn';
import DownloadBtn from './btn/download-btn';
import HandBackBtn from './btn/handback-btn';
import { ImportBtn } from './btn/import-btn';
import { SettingBtn } from './btn/setting-btn';
import useStyle from './styles';

export const AppHeader: React.FC = () => {
  const { autoFitBounds } = useGlobal();
  const { saveEditorText, savable, bboxAutoFit, features } = useFeature();
  const styles = useStyle();

  const onSave = () => {
    if (!savable) {
      return;
    }
    const features = saveEditorText();
    if (autoFitBounds) {
      bboxAutoFit(features);
    }
  };

  useKeyPress(['ctrl.s', 'meta.s'], (e) => {
    e.preventDefault();
    onSave();
  });

  const featureDisabled = useMemo(() => {
    return !features.length && !savable;
  }, [features, savable]);

  return (
    <div className={styles.mapContentLeft}>
      <div>
        <ImportBtn />
        <Button icon={<SaveOutlined />} disabled={!savable} onClick={onSave}>
          保存
        </Button>
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
          <Button icon={<ClearOutlined />} disabled={featureDisabled}>
            清除
          </Button>
        </Popconfirm>
        <Button
          disabled={featureDisabled}
          icon={<IconFont type="icon-zishiying" />}
          onClick={() => {
            bboxAutoFit();
          }}
        >
          自适应
        </Button>
      </div>
      <div className={styles.mapContentRight}>
        <SettingBtn />
        <DownloadBtn />
        <ChangeLog />
        <HandBackBtn />
        <DingImgBtn />
      </div>
    </div>
  );
};
