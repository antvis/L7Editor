import { FlagOutlined, SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Dropdown, Switch, Tour } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { toolbarProps } from 'src/types/l7editor';
import { useFeature, useGlobal } from '../../recoil';
import DownloadBtn from './btn/download-btn';
import HandBackBtn from './btn/handback-btn';
import { ImportBtn } from './btn/import-btn';
import { SettingBtn } from './btn/setting-btn';
import { DropdownMenuItems, functionSteps, steps } from './constants';
import useStyle from './styles';

type openType = {
  key: string;
  open: boolean;
};

type AppHeaderProps = {
  toolBar?: toolbarProps;
};

const isTooBar = {
  logo: true,
  import: true,
  download: true,
  guide: true,
  help: true,
  setting: true,
  theme: true,
};

export const AppHeader: React.FC<AppHeaderProps> = ({ toolBar }) => {
  const [open, setOpen] = useState<openType>({ key: '', open: false });
  const { autoFitBounds, theme, setTheme } = useGlobal();
  const { saveEditorText, savable, bboxAutoFit } = useFeature();
  const [isTooBarState, setIsTooBar] = useState(isTooBar);
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

  const onDownload = (key: string) => {
    setOpen({ key, open: true });
  };

  useEffect(() => {
    setIsTooBar({ ...isTooBar, ...toolBar });
  }, [toolBar]);

  return (
    <div className={classNames([styles.mapHeader, 'l7-editor-header'])}>
      <div className={styles.mapHeaderLeft}>
        {isTooBarState.logo && (
          <div
            className={classNames([
              styles.mapHeaderLogo,
              'l7-editor-header__logo',
            ])}
          >
            <img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QGswQZ2nlGkAAAAAAAAAAAAADmJ7AQ/original" />
            <span className={styles.mapHeaderTitle}>L7Editor</span>
          </div>
        )}
        {isTooBarState.import && <ImportBtn />}
        <Button
          id="l7-editor-save"
          icon={<SaveOutlined />}
          disabled={!savable}
          onClick={onSave}
        >
          保存
        </Button>
      </div>
      <div className={styles.mapHeaderRight}>
        {isTooBarState.download && <DownloadBtn />}
        {isTooBarState.guide && (
          <Dropdown
            menu={{
              items: DropdownMenuItems,
              onClick: ({ key }) => {
                onDownload(key);
              },
            }}
          >
            <Button icon={<FlagOutlined />}>引导</Button>
          </Dropdown>
        )}
        {isTooBarState.help && <HandBackBtn />}
        {isTooBarState.setting && <SettingBtn />}
        {isTooBarState.theme && (
          <Switch
            checkedChildren="亮"
            unCheckedChildren="暗"
            defaultChecked={theme === 'normal' ? true : false}
            onChange={(checked: boolean) => {
              setTheme(checked ? 'normal' : 'dark');
            }}
          />
        )}
      </div>
      <Tour
        open={open.open}
        onClose={() => setOpen({ key: '', open: false })}
        steps={open.key === 'basics' ? steps : functionSteps}
      />
    </div>
  );
};
