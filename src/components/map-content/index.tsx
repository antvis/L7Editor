import DingImgBtn from '@/components/map-content/ding-img-btn';
import { SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import { AppEditor } from '../app-editor';
import './index.less';
import DownloadBtn from './download-btn';
import LngLatImportBtn from './lnglat-import-btn';

export const MapContent: React.FC = () => {
  const { saveEditorText, savable } = useModel('feature');

  useKeyPress(['ctrl.s', 'meta.s'], (e) => {
    e.preventDefault();
    if (!savable) {
      return;
    }
    saveEditorText();
  });

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
          <DownloadBtn />
          <DingImgBtn />
        </div>
      </div>
      <div className="map-content__right">
        <AppEditor />
      </div>
    </div>
  );
};
