import { FlagOutlined, SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import {
  Button,
  Dropdown,
  MenuProps,
  Switch,
  Tooltip,
  Tour,
  TourProps,
} from 'antd';
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
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState<openType>({ key: '', open: false });
  const { autoFitBounds, theme, setTheme, locale, setLocale } = useGlobal();
  const { saveEditorText, savable, bboxAutoFit } = useFeature();
  const [isTooBarState, setIsTooBar] = useState(isTooBar);
  const styles = useStyle();

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
            <img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QGswQZ2nlGkAAAAAAAAAAAAADmJ7AQ/original" />
            <span className={styles.mapHeaderTitle}>L7Editor</span>
          </div>
        )}
      </div>
      <div className={styles.mapHeaderRight}>
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
        {isTooBarState.theme && (
          <Switch
            id="l7-editor-theme"
            checkedChildren={t('app_header.index.liang')}
            unCheckedChildren={t('app_header.index.an')}
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
              i18n.changeLanguage('zh-CN');
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
