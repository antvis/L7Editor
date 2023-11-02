import {
  DingtalkOutlined,
  FlagOutlined,
  GithubOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useKeyPress, useLocalStorageState } from 'ahooks';
import type { MenuProps, TourProps } from 'antd';
import { Button, Divider, Dropdown, Popover, Space, Tooltip, Tour } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalStorageKey } from '../../constants';
import { useFeature, useGlobal } from '../../recoil';
import type { ToolbarProps } from '../../types/l7editor';
import { IconFont } from '../iconfont';
import { BaseMap } from './base-map';
import DownloadBtn from './btn/download-btn';
import HandBackBtn from './btn/handback-btn';
import I18nBtn from './btn/i18n-btn';
import { ImportBtn } from './btn/import-btn';
import { SettingBtn } from './btn/setting-btn';
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
  dingTalk: true,
  i18n: true,
  github: true,
  baseMap: true,
};

export const AppHeader: React.FC<AppHeaderProps> = ({ toolbar }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<openType>({ key: '', open: false });
  const { autoFitBounds, theme, setTheme } = useGlobal();
  const { saveEditorText, savable, bboxAutoFit } = useFeature();
  const [isTooBarState, setIsTooBar] = useState(isTooBar);
  const styles = useStyle();
  const [firstOpen, setFirstOpen] = useLocalStorageState<boolean>(
    LocalStorageKey.firstOpening,
    {
      defaultValue: true,
    },
  );

  useEffect(() => {
    if (firstOpen) {
      setOpen({
        key: 'basics',
        open: true,
      });
      setFirstOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DropdownMenuItems: MenuProps['items'] = [
    {
      key: 'basics',
      label: t('app_header.constants.pingTaiJiChuShi'),
    },
    {
      key: 'function',
      label: t('app_header.constants.quanGongNengShiYong'),
    },
  ];

  const steps: TourProps['steps'] = [
    {
      title: t('import_btn.index.shangChuan'),
      description: t('app_header.constants.shangChuanGEO'),
      cover: (
        <img
          alt={t('app_header.constants.shangChuanPNG')}
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      target: () => document.getElementById('l7-editor-upload')!,
    },
    {
      title: t('app_header.constants.bianJiQi'),
      description: t('app_header.constants.keYiTongGuoBian'),
      target: () => document.getElementById('l7-editor-panel')!,
      placement: 'left',
    },
    {
      title: t('app_header.constants.huiZhi'),
      cover: (
        <img
          alt={t('app_header.constants.huiZhiPNG')}
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      description: t('app_header.constants.keYiJiHuoDi'),
      target: () => document.getElementById('l7-editor-draw')!,
      placement: 'right',
    },
    {
      title: t('app_header.constants.baoCun'),
      description: t('app_header.constants.shiYongCTR'),
      target: () => document.getElementById('l7-editor-save')!,
    },
    {
      title: t('app_header.constants.xuanRan'),
      description: t('app_header.constants.diTuShangChaKan'),
      target: () => document.getElementById('l7-editor-map')!,
      placement: 'right',
    },
  ];

  const functionSteps: TourProps['steps'] = [
    {
      title: t('import_btn.index.shangChuan'),
      description: t('app_header.constants.shangChuanGEO'),
      cover: (
        <img
          alt={t('app_header.constants.shangChuanPNG')}
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      target: () => document.getElementById('l7-editor-upload')!,
    },
    {
      title: t('app_header.constants.baoCun'),
      description: t('app_header.constants.shiYongCTR'),
      target: () => document.getElementById('l7-editor-save')!,
    },
    {
      title: t('btn.download_btn.xiaZai'),
      description: t('app_header.constants.dianJiXiaZaiKe'),
      target: () => document.getElementById('l7-editor-download')!,
    },
    {
      title: t('btn.setting_btn.sheZhi'),
      description: t('app_header.constants.yongHuKeSheZhi'),
      target: () => document.getElementById('l7-editor-set')!,
    },
    {
      title: t('app_header.constants.zhuTi'),
      description: t('app_header.constants.dianJiKeQieHuan'),
      target: () => document.getElementById('l7-editor-theme')!,
    },
    {
      title: t('app_header.constants.xingZhengQuXuanZe'),
      description: t('app_header.constants.keYiKuaiSuXuan'),
      target: () => document.getElementById('l7-editor-administrativeSelect')!,
    },
    {
      title: t('app_header.constants.chengShiChaXun'),
      description: t('app_header.constants.souSuoChengShiHou'),
      target: () => document.getElementById('l7-editor-citySelect')!,
    },
    {
      title: t('app_header.constants.huiZhi'),
      cover: (
        <img
          alt={t('app_header.constants.huiZhiPNG')}
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      description: t('app_header.constants.keYiJiHuoDi'),
      target: () => document.getElementById('l7-editor-draw')!,
      placement: 'right',
    },
    {
      title: t('app_header.constants.qingChu'),
      description: t('app_header.constants.dianJiQingChuAn'),
      target: () => document.getElementById('l7-editor-clear')!,
    },
    {
      title: t('app_header.constants.shaiXuan'),
      description: t('app_header.constants.keGenJuShuJu'),
      target: () => document.getElementById('l7-editor-filter')!,
    },
    {
      title: t('app_header.constants.ziDongSuoFang'),
      description: t('app_header.constants.dianJiZiDongSuo'),
      target: () => document.getElementById('l7-editor-auto')!,
    },
    {
      title: t('app_header.constants.yanSeXuanZeQi'),
      description: t('app_header.constants.xuanZeYanSeLai'),
      target: () => document.getElementById('l7-editor-color')!,
    },
    {
      title: t('app_header.constants.zhuTiSe'),
      description: t('app_header.constants.xuanZeBuTongZhu'),
      //@ts-ignore
      target: () => document.getElementsByClassName('l7-editor-mapTheme')[0]!,
    },
    {
      title: t('app_header.constants.guanFangTuCeng'),
      description: t('app_header.constants.keXuanZeBuTong'),
      target: () => document.getElementById('l7-editor-aMap')!,
    },
    {
      title: t('app_header.constants.gEOJS'),
      description: t('app_header.constants.keYiTongGuoBian'),
      target: () => document.getElementById('l7-editor-panel')!,
      placement: 'left',
    },
    {
      title: t('app_header.constants.wKTBianJi'),
      description: t('app_header.constants.keYiTongGuoW'),
      target: () => document.getElementById('l7-editor-wkt')!,
      placement: 'left',
    },
    {
      title: t('app_header.constants.biaoGe'),
      description: t('app_header.constants.keYiTongGuoBiao'),
      target: () => document.getElementById('l7-editor-table')!,
      placement: 'left',
    },
  ];

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
            <img src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RSdESJd70P8AAAAAAAAAAAAADjWqAQ/original" />
            <span className={styles.mapHeaderTitle}>L7 Editor</span>
          </div>
        )}
        {isTooBarState.baseMap && (
          <>
            <Divider type="vertical" />
            <BaseMap />
          </>
        )}
      </div>
      <div className={styles.mapHeaderRight}>
        <Space>
          {isTooBarState.import && <ImportBtn />}
          <Tooltip title={t('app_header.index.baoCunShuJu')}>
            <Button
              id="l7-editor-save"
              icon={<SaveOutlined />}
              disabled={!savable}
              onClick={onSave}
            >
              {t('app_header.constants.baoCun')}
            </Button>
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
              <Button icon={<FlagOutlined />}>
                {t('app_header.index.yinDao')}
              </Button>
            </Dropdown>
          )}
          {isTooBarState.help && <HandBackBtn />}
          {isTooBarState.setting && <SettingBtn />}
        </Space>

        <Divider type="vertical" />

        <Space>
          {isTooBarState.dingTalk && (
            <Popover
              title={t('app_header.index.dingTalk')}
              content={
                <img
                  style={{ width: 300 }}
                  src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*LxZCT7FIMdsAAAAAAAAAAAAADjWqAQ/original"
                />
              }
              trigger="hover"
            >
              <Button icon={<DingtalkOutlined />} />
            </Popover>
          )}
          {isTooBarState.theme && (
            <Tooltip title={t('app_header.index.zhutiqiehuan')} trigger="hover">
              <Button
                id="l7-editor-theme"
                icon={
                  <IconFont
                    className={styles.themeIcon}
                    type={
                      theme === 'dark'
                        ? 'icon-a-qingtianwanshang'
                        : 'icon-taiyang'
                    }
                  />
                }
                // className={styles.theme}
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
              />
            </Tooltip>
          )}
          {isTooBarState.i18n && <I18nBtn />}
          {isTooBarState.github && (
            <Tooltip title={'Github'} trigger="hover">
              <Button
                icon={<GithubOutlined />}
                onClick={() => {
                  window.open('https://github.com/antvis/L7Editor');
                }}
              />
            </Tooltip>
          )}
        </Space>
      </div>
      <Tour
        open={open.open}
        onClose={() => setOpen({ key: '', open: false })}
        steps={open.key === 'basics' ? steps : functionSteps}
      />
    </div>
  );
};
