import DingImgBtn from '@/components/map-content/btn/ding-img-btn';
import HandBackBtn from '@/components/map-content/btn/handback-btn';
import { IconFont } from '@/constants';
import useFeature from '@/recoil/feature';
import useGlobal from '@/recoil/global';
import { prettierText } from '@/utils/prettier-text';
import {
  ClearOutlined,
  CodeOutlined,
  SaveOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Popconfirm, Tabs, TabsProps, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { AppEditor } from '../app-editor';
import { AppTable } from '../app-table';
import ChangeLog from './btn/changelog-btn';
import DownloadBtn from './btn/download-btn';
import { ImportBtn } from './btn/import-btn';
import { SettingBtn } from './btn/setting-btn';
import './index.less';

export const MapContent: React.FC = () => {
  const { autoFitBounds, activeTab, setActiveTab } = useGlobal();
  const { saveEditorText, savable, bboxAutoFit, features } = useFeature();

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

  const items: TabsProps['items'] = [
    {
      key: 'code',
      label: (
        <div>
          <CodeOutlined style={{ marginLeft: 5 }} />
          编辑器
        </div>
      ),
      children: <AppEditor />,
    },
    {
      key: 'table',
      label: (
        <div>
          <TableOutlined style={{ marginLeft: 5 }} />
          表格
        </div>
      ),
      children: <AppTable />,
    },
  ];

  const featureDisabled = useMemo(() => {
    return !features.length && !savable;
  }, [features, savable]);

  return (
    <div className="map-content">
      <div className="map-content__left">
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
        className="map-content__right"
        defaultActiveKey="code"
        items={items}
        onChange={(e) => {
          setActiveTab(e as 'code' | 'table');
        }}
      />
    </div>
  );
};
