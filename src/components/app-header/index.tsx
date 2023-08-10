import { FlagOutlined, SaveOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Dropdown, Switch, Tour, TourProps } from 'antd';
import React, { useState } from 'react';
import { useFeature, useGlobal } from '../../recoil';
import DownloadBtn from './btn/download-btn';
import HandBackBtn from './btn/handback-btn';
import { ImportBtn } from './btn/import-btn';
import { SettingBtn } from './btn/setting-btn';
import { DropdownMenuItems } from './constants';
import useStyle from './styles';

type openType = {
  key: string;
  open: boolean;
};

export const AppHeader: React.FC = () => {
  const [open, setOpen] = useState<openType>({ key: '', open: false });
  const { autoFitBounds, theme, setTheme } = useGlobal();
  const { saveEditorText, savable, bboxAutoFit } = useFeature();
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

  const steps: TourProps['steps'] = [
    {
      title: '上传',
      description: '上传 GeoJSON 数据',
      cover: (
        <img
          alt="上传.png"
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      target: () => document.getElementById('l7-editor-driver-upload')!,
    },
    {
      title: '编辑器',
      description: '可以通过编辑器修改 GeoJSON 数据',
      target: () => document.getElementById('l7-editor-driver-panel')!,
      placement: 'left',
    },
    {
      title: '绘制',
      cover: (
        <img
          alt="绘制.png"
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      description: '可以激活地图绘制新增 GeoJSON 元素',
      target: () => document.getElementById('l7-editor-driver-draw')!,
      placement: 'right',
    },
    {
      title: '保存',
      description:
        '使用 Ctrl/Command + S 快捷键，或点击保存按钮渲染数据（已保存状态下保存按钮置灰）',
      target: () => document.getElementById('l7-editor-driver-save')!,
    },
    {
      title: '渲染',
      description: '地图上查看渲染效果',
      target: () => document.getElementById('l7-editor-driver-map')!,
      placement: 'right',
    },
  ];

  const functionSteps: TourProps['steps'] = [
    {
      title: '上传',
      description: '上传 GeoJSON 数据',
      cover: (
        <img
          alt="上传.png"
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*RJfORKi3ntsAAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      target: () => document.getElementById('l7-editor-driver-upload')!,
    },
    {
      title: '保存',
      description:
        '使用 Ctrl/Command + S 快捷键，或点击保存按钮渲染数据（已保存状态下保存按钮置灰）',
      target: () => document.getElementById('l7-editor-driver-save')!,
    },
    {
      title: '清除',
      description:
        '点击清除按钮 GeoJSON 数据将被请空 （已清空状态下清空按钮置灰）',
      target: () => document.getElementById('l7-editor-driver-clear')!,
    },
    {
      title: '自动缩放',
      description: '点击自动缩放按钮 地图将自动缩放的 GeoJSON 数据位置',
      target: () => document.getElementById('l7-editor-driver-auto')!,
    },
    {
      title: '下载',
      description: '点击下载可将 GeoJSON 数据下载为指定数据格式',
      target: () => document.getElementById('l7-editor-driver-download')!,
    },
    {
      title: '设置',
      description: '用户可设置一些初始化配置',
      target: () => document.getElementById('l7-editor-driver-set')!,
    },
    {
      title: '绘制',
      cover: (
        <img
          alt="绘制.png"
          src="https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*NNcDQrzkdt8AAAAAAAAAAAAADjWqAQ/original"
        />
      ),
      description: '可以激活地图绘制新增 GeoJSON 元素',
      target: () => document.getElementById('l7-editor-driver-draw')!,
      placement: 'right',
    },
    {
      title: '城市查询',
      description: '搜索城市后可快速定位并移动至对应城市中心点',
      target: () => document.getElementById('l7-editor-driver-citySelect')!,
    },
    {
      title: '筛选',
      description: '可根据数据中的properties来筛选需要数据',
      target: () => document.getElementById('l7-editor-driver-filter')!,
    },
    {
      title: '底图',
      description: '可选择不同的地图底图配置',
      target: () => document.getElementById('l7-editor-driver-aMap')!,
    },
    {
      title: '主题色',
      description: '选择不同主题色来修改地图渲染主题颜色',
      //@ts-ignore
      target: () =>
        document.getElementsByClassName('l7-editor-driver-theme')[0]!,
    },
    {
      title: '颜色选择器',
      description: '选择颜色来修改地图渲染颜色',
      target: () => document.getElementById('l7-editor-driver-color')!,
    },
    {
      title: '编辑器',
      description: '可以通过编辑器修改 GeoJSON 数据',
      target: () => document.getElementById('l7-editor-driver-panel')!,
      placement: 'left',
    },
    {
      title: '表格',
      description:
        '可以通过表格来展示修改删除GeoJSON 数据中的properties对象中的字段',
      target: () => document.getElementById('l7-editor-driver-table')!,
      placement: 'left',
    },
  ];

  const onDownload = (key: string) => {
    setOpen({ key, open: true });
  };

  return (
    <div className={styles.mapHeader}>
      <div className={styles.mapHeaderLeft}>
        <img
          className={styles.mapHeaderLogo}
          src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QGswQZ2nlGkAAAAAAAAAAAAADmJ7AQ/original"
        />
        <span className={styles.mapHeaderTitle}>L7Editor</span>
        <ImportBtn />
        <Button
          id="l7-editor-driver-save"
          icon={<SaveOutlined />}
          disabled={!savable}
          onClick={onSave}
        >
          保存
        </Button>
      </div>
      <div className={styles.mapHeaderRight}>
        <DownloadBtn />
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
        <HandBackBtn />
        <SettingBtn />
        <Switch
          checkedChildren="光"
          unCheckedChildren="暗"
          defaultChecked={theme === 'norm' ? true : false}
          onChange={(checked: boolean) => {
            setTheme(checked ? 'norm' : 'dark');
          }}
        />
      </div>
      <Tour
        open={open.open}
        onClose={() => setOpen({ key: '', open: false })}
        steps={open.key === 'basics' ? steps : functionSteps}
      />
    </div>
  );
};
