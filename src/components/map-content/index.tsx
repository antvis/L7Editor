import DingImgBtn from '@/components/map-content/ding-img-btn';
import { CodeOutlined, SaveOutlined, TableOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Tabs, TabsProps, Tooltip } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import { AppEditor } from '../app-editor';
import './index.less';
import DownloadBtn from './download-btn';
import LngLatImportBtn from './lnglat-import-btn';
import { SettingBtn } from './setting-btn';
import { Tables } from './table';

export const MapContent: React.FC = () => {
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
      children: (
        <div className="map-content__right">
          <AppEditor />
        </div>
      ),
    },
    {
      key: 'table',
      label: (
        <div>
          <TableOutlined style={{ marginLeft: 5 }} />
          表格
        </div>
      ),
      children: (
        <div>
          <Tables />
        </div>
      ),
    },
  ];

  return (
    <div className="map-content">
      <div className="map-content__left">
        <div>
          <LngLatImportBtn />
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
      <div style={{ width: '100%' }}>
        <Tabs defaultActiveKey="code" items={items} />
      </div>
    </div>
  );
};
