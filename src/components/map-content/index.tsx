import DingImgBtn from '@/components/map-content/btn/ding-img-btn';
import HandBackBtn from '@/components/map-content/btn/handback-btn';
import { IconFont } from '@/constants';
import { useFeature, useGlobal } from '@/recoil';
import { prettierText } from '@/utils/prettier-text';
import { ClearOutlined, SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Popconfirm, Tabs, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import ChangeLog from './btn/changelog-btn';
import DownloadBtn from './btn/download-btn';
import { ImportBtn } from './btn/import-btn';
import { SettingBtn } from './btn/setting-btn';
import './index.less';
import useStyle from './styles';

export const MapContent: React.FC = ({ tabItem }) => {
  const { autoFitBounds, activeTab, setActiveTab } = useGlobal();
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
    <div className={styles.mapContent}>
      <div className={styles.mapContentLeft}>
        <div>
          <ImportBtn />
          <Tooltip
            trigger="hover"
            placement="left"
            overlay="保存（Ctrl/Command + S）"
          >
            <Button
              icon={<SaveOutlined />}
              disabled={!savable}
              onClick={onSave}
            ></Button>
          </Tooltip>
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
            <Tooltip trigger="hover" placement="left" overlay="清空数据">
              <Button icon={<ClearOutlined />} disabled={featureDisabled} />
            </Tooltip>
          </Popconfirm>

          <Tooltip
            trigger="hover"
            placement="left"
            overlay="缩放至所有元素可见"
          >
            <Button
              disabled={featureDisabled}
              icon={<IconFont type="icon-zishiying" />}
              onClick={() => {
                bboxAutoFit();
              }}
            />
          </Tooltip>
        </div>

        <div>
          <SettingBtn />
          <DownloadBtn />
          <ChangeLog />
          <HandBackBtn />
          <DingImgBtn />
        </div>
      </div>
      <Tabs
        activeKey={activeTab}
        className={styles.mapContentRight}
        defaultActiveKey="code"
        items={tabItem}
        onChange={(e) => {
          setActiveTab(e as 'code' | 'table');
        }}
      />
    </div>
  );
};
