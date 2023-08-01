import DingImgBtn from '@/components/map-content/btn/ding-img-btn';
import HandBackBtn from '@/components/map-content/btn/handback-btn';
import { IconFont } from '@/constants';
import { useFeature, useGlobal } from '@/recoil';
import { prettierText } from '@/utils/prettier-text';
import { ClearOutlined, SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Popconfirm } from 'antd';
import React, { useMemo } from 'react';
import ChangeLog from '../map-content/btn/changelog-btn';
import DownloadBtn from '../map-content/btn/download-btn';
import { ImportBtn } from '../map-content/btn/import-btn';
import { SettingBtn } from '../map-content/btn/setting-btn';
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
