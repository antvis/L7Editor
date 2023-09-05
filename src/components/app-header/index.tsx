import I18N from '@/locales';
import { FlagOutlined, SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Dropdown, Switch, Tooltip, Tour } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconFont } from '../../constants';
import { useFeature, useGlobal } from '../../recoil';
import { ToolbarProps } from '../../types/l7editor';
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
  toolbar?: ToolbarProps;
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

export const AppHeader: React.FC<AppHeaderProps> = ({ toolbar }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState<openType>({ key: '', open: false });
  const { autoFitBounds, theme, setTheme, locale, setLocale } = useGlobal();
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
    setIsTooBar({ ...isTooBar, ...toolbar });
  }, [toolbar]);

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
      </div>
      <div className={styles.mapHeaderRight}>
        {isTooBarState.import && <ImportBtn />}
        <Tooltip title={I18N.t('app_header.index.baoCunShuJu')}>
          <Button
            id="l7-editor-save"
            icon={<SaveOutlined />}
            disabled={!savable}
            onClick={onSave}
          >
            {I18N.t('app_header.constants.baoCun')}</Button>
        </Tooltip>
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
            <Button icon={<FlagOutlined />}>{I18N.t('app_header.index.yinDao')}</Button>
          </Dropdown>
        )}
        {isTooBarState.help && <HandBackBtn />}
        {isTooBarState.setting && <SettingBtn />}
        {isTooBarState.theme && (
          <Switch
            id="l7-editor-theme"
            checkedChildren={I18N.t('app_header.index.liang')}
            unCheckedChildren={I18N.t('app_header.index.an')}
            defaultChecked={theme === 'normal' ? true : false}
            onChange={(checked: boolean) => {
              setTheme(checked ? 'normal' : 'dark');
            }}
          />
        )}
        <Button
          className={styles.locale}
          onClick={() => {
            if (locale === 'zh') {
              i18n.changeLanguage('en');
              setLocale('en');
            } else {
              i18n.changeLanguage('zh');
              setLocale('zh');
            }
          }}
        >
          <IconFont
            className={styles.localeIcon}
            type={
              locale === 'zh'
                ? 'icon-zhongyingwenqiehuan-zhongwen'
                : 'icon-zhongyingwenqiehuan-yingwen'
            }
          />
        </Button>
      </div>
      <Tour
        open={open.open}
        onClose={() => setOpen({ key: '', open: false })}
        steps={open.key === 'basics' ? steps : functionSteps}
      />
    </div>
  );
};
