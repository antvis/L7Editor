import DingImgBtn from '@/components/map-content/btn/ding-img-btn';
import { CodeOutlined, SaveOutlined, TableOutlined } from '@ant-design/icons';
import { useKeyPress, useLocalStorageState } from 'ahooks';
import { Button, Tabs, TabsProps, Tooltip } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import { AppEditor } from '../app-editor';
import './index.less';
import DownloadBtn from './btn/download-btn';
import LngLatImportBtn from './btn/lnglat-import-btn';
import { SettingBtn } from './btn/setting-btn';
import { AppTable } from '../app-table';
import { UrlBtn } from './btn/url-btn';
import { LocalstorageKey } from '@/constants';

export const MapContent: React.FC = () => {
  const [activeTab, setActiveTab] = useLocalStorageState<'code' | 'table'>(
    LocalstorageKey.activeRightTabKey,
    {
      defaultValue: 'code',
    },
  );
  const { saveEditorText, savable } = useModel('feature');

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

  return (
    <div className="map-content">
      <div className="map-content__left">
        <div>
          <LngLatImportBtn />
          <UrlBtn />
          <Tooltip
            trigger="hover"
            placement="left"
            overlay="保存（Ctrl/Command + S）"
          >
            <Button
              icon={<SaveOutlined />}
              disabled={!savable}
              onClick={saveEditorText}
            ></Button>
          </Tooltip>
        </div>

        <div>
          <SettingBtn />
          <DownloadBtn />
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
