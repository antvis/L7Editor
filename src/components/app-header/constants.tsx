import I18N from '../../locales';
import { MenuProps, TourProps } from 'antd';
import React from 'react';

console.log(I18N);

export const HandBackMenuItems: MenuProps['items'] = [
  {
    key: 'text',
    label: I18N.t('app_header.constants.pingTaiShiYongWen'),
  },
  {
    key: 'api',
    label: I18N.t('app_header.constants.zuJianAPI'),
  },
  {
    key: 'ding',
    label: I18N.t('btn.handback_btn.lianXiWoMen'),
  },
];

export const DownloadMenuItems: MenuProps['items'] = [
  {
    key: 'GeoJson',
    label: I18N.t('app_header.constants.xiaZaiGEO'),
  },
  // {
  //   key: 'FormatGeoJson',
  //   label: '下载格式化的 GeoJson 格式数据',
  // },
  {
    key: 'LngLat',
    label: I18N.t('app_header.constants.xiaZaiLNG'),
  },
  // {
  //   key: 'Text',
  //   label: '下载当前编辑器输入数据',
  // },
  {
    key: 'KML',
    label: I18N.t('app_header.constants.xiaZaiKML'),
  },
  {
    key: 'WKT',
    label: I18N.t('app_header.constants.xiaZaiWKT'),
  },
];

export const DropdownMenuItems: MenuProps['items'] = [
  {
    key: 'basics',
    label: I18N.t('app_header.constants.pingTaiJiChuShi'),
  },
  {
    key: 'function',
    label: I18N.t('app_header.constants.quanGongNengShiYong'),
  },
];

export const steps: TourProps['steps'] = [
  {
    title: I18N.t('import_btn.index.shangChuan'),
    description: I18N.t('app_header.constants.shangChuanGEO'),
    cover: (
      <img
        alt={I18N.t('app_header.constants.shangChuanPNG')}
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    target: () => document.getElementById('l7-editor-upload')!,
  },
  {
    title: I18N.t('app_header.constants.bianJiQi'),
    description: I18N.t('app_header.constants.keYiTongGuoBian'),
    target: () => document.getElementById('l7-editor-panel')!,
    placement: 'left',
  },
  {
    title: I18N.t('app_header.constants.huiZhi'),
    cover: (
      <img
        alt={I18N.t('app_header.constants.huiZhiPNG')}
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    description: I18N.t('app_header.constants.keYiJiHuoDi'),
    target: () => document.getElementById('l7-editor-draw')!,
    placement: 'right',
  },
  {
    title: I18N.t('app_header.constants.baoCun'),
    description: I18N.t('app_header.constants.shiYongCTR'),
    target: () => document.getElementById('l7-editor-save')!,
  },
  {
    title: I18N.t('app_header.constants.xuanRan'),
    description: I18N.t('app_header.constants.diTuShangChaKan'),
    target: () => document.getElementById('l7-editor-map')!,
    placement: 'right',
  },
];

export const functionSteps: TourProps['steps'] = [
  {
    title: I18N.t('import_btn.index.shangChuan'),
    description: I18N.t('app_header.constants.shangChuanGEO'),
    cover: (
      <img
        alt={I18N.t('app_header.constants.shangChuanPNG')}
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    target: () => document.getElementById('l7-editor-upload')!,
  },
  {
    title: I18N.t('app_header.constants.baoCun'),
    description: I18N.t('app_header.constants.shiYongCTR'),
    target: () => document.getElementById('l7-editor-save')!,
  },
  {
    title: I18N.t('btn.download_btn.xiaZai'),
    description: I18N.t('app_header.constants.dianJiXiaZaiKe'),
    target: () => document.getElementById('l7-editor-download')!,
  },
  {
    title: I18N.t('btn.setting_btn.sheZhi'),
    description: I18N.t('app_header.constants.yongHuKeSheZhi'),
    target: () => document.getElementById('l7-editor-set')!,
  },
  {
    title: I18N.t('app_header.constants.zhuTi'),
    description: I18N.t('app_header.constants.dianJiKeQieHuan'),
    target: () => document.getElementById('l7-editor-theme')!,
  },
  {
    title: I18N.t('app_header.constants.xingZhengQuXuanZe'),
    description: I18N.t('app_header.constants.keYiKuaiSuXuan'),
    target: () => document.getElementById('l7-editor-administrativeSelect')!,
  },
  {
    title: I18N.t('app_header.constants.chengShiChaXun'),
    description: I18N.t('app_header.constants.souSuoChengShiHou'),
    target: () => document.getElementById('l7-editor-citySelect')!,
  },
  {
    title: I18N.t('app_header.constants.huiZhi'),
    cover: (
      <img
        alt={I18N.t('app_header.constants.huiZhiPNG')}
        src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
      />
    ),
    description: I18N.t('app_header.constants.keYiJiHuoDi'),
    target: () => document.getElementById('l7-editor-draw')!,
    placement: 'right',
  },
  {
    title: I18N.t('app_header.constants.qingChu'),
    description: I18N.t('app_header.constants.dianJiQingChuAn'),
    target: () => document.getElementById('l7-editor-clear')!,
  },
  {
    title: I18N.t('app_header.constants.shaiXuan'),
    description: I18N.t('app_header.constants.keGenJuShuJu'),
    target: () => document.getElementById('l7-editor-filter')!,
  },
  {
    title: I18N.t('app_header.constants.ziDongSuoFang'),
    description: I18N.t('app_header.constants.dianJiZiDongSuo'),
    target: () => document.getElementById('l7-editor-auto')!,
  },
  {
    title: I18N.t('app_header.constants.yanSeXuanZeQi'),
    description: I18N.t('app_header.constants.xuanZeYanSeLai'),
    target: () => document.getElementById('l7-editor-color')!,
  },
  {
    title: I18N.t('app_header.constants.zhuTiSe'),
    description: I18N.t('app_header.constants.xuanZeBuTongZhu'),
    //@ts-ignore
    target: () => document.getElementsByClassName('l7-editor-mapTheme')[0]!,
  },
  {
    title: I18N.t('app_header.constants.guanFangTuCeng'),
    description: I18N.t('app_header.constants.keXuanZeBuTong'),
    target: () => document.getElementById('l7-editor-aMap')!,
  },
  {
    title: I18N.t('app_header.constants.gEOJS'),
    description: I18N.t('app_header.constants.keYiTongGuoBian'),
    target: () => document.getElementById('l7-editor-panel')!,
    placement: 'left',
  },
  {
    title: I18N.t('app_header.constants.wKTBianJi'),
    description: I18N.t('app_header.constants.keYiTongGuoW'),
    target: () => document.getElementById('l7-editor-wkt')!,
    placement: 'left',
  },
  {
    title: I18N.t('app_header.constants.biaoGe'),
    description: I18N.t('app_header.constants.keYiTongGuoBiao'),
    target: () => document.getElementById('l7-editor-table')!,
    placement: 'left',
  },
];
