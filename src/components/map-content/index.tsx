import DingImgBtn from '@/components/map-content/btn/ding-img-btn';
import {
  ClearOutlined,
  CodeOutlined,
  SaveOutlined,
  TableOutlined,
} from '@ant-design/icons';
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
import HandBackBtn from './btn/handback-btn';
import { LocalstorageKey } from '@/constants';
import { prettierText } from '@/utils/prettier-text';

export const MapContent: React.FC = () => {
  const { setEditorText } = useModel('feature');
  const [activeTab, setActiveTab] = useLocalStorageState<'code' | 'table'>(
    LocalstorageKey.ActiveRightTabKey,
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
          <Tooltip trigger="hover" placement="left" overlay="重置数据">
            <Button
              icon={<ClearOutlined />}
              onClick={() => {
                setEditorText(
                  prettierText({
                    content: { type: 'FeatureCollection', features: [] }
                  }),
                );
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
