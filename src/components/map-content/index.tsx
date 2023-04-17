import DingImgBtn from '@/components/map-content/btn/ding-img-btn';
import { IconFont, LocalstorageKey } from '@/constants';
import { prettierText } from '@/utils/prettier-text';
import {
  ClearOutlined,
  CodeOutlined,
  SaveOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useKeyPress, useLocalStorageState } from 'ahooks';
import { Button, Tabs, TabsProps, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { AppEditor } from '../app-editor';
import { AppTable } from '../app-table';
import DownloadBtn from './btn/download-btn';
import HandBackBtn from './btn/handback-btn';
import { SettingBtn } from './btn/setting-btn';
import { UrlBtn } from './btn/url-btn';
import './index.less';

export const MapContent: React.FC = () => {
  const { bboxAutoFit } = useModel('feature');
  const [activeTab, setActiveTab] = useLocalStorageState<'code' | 'table'>(
    LocalstorageKey.ActiveRightTabKey,
    {
      defaultValue: 'code',
    },
  );
  const { saveEditorText, savable, setFeatures, features } =
    useModel('feature');

  useKeyPress(['ctrl.s', 'meta.s'], (e) => {
    e.preventDefault();
    if (!savable) {
      return;
    }
    saveEditorText();
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
    console.log(!savable);
    return !features.length && !savable;
  }, [features, savable]);

  return (
    <div className="map-content">
      <div className="map-content__left">
        <div>
          <UrlBtn />
          <Tooltip
            trigger="hover"
            placement="left"
            overlay="保存（Ctrl/Command + S）"
          >
            <Button
              icon={<SaveOutlined />}
              disabled={!savable}
              onClick={() => saveEditorText()}
            ></Button>
          </Tooltip>
          <Tooltip trigger="hover" placement="left" overlay="清空数据">
            <Button
              icon={<ClearOutlined />}
              disabled={featureDisabled}
              onClick={() => {
                saveEditorText(
                  prettierText({
                    content: { type: 'FeatureCollection', features: [] },
                  }),
                );
              }}
            />
          </Tooltip>
          <Tooltip trigger="hover" placement="left" overlay="平移中心点">
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
