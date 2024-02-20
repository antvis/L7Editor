import { GlobalOutlined, TableOutlined } from '@ant-design/icons';
import type { Feature } from '@turf/turf';
import type { TabsProps } from 'antd';
import { Select, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeature, useGlobal } from '../../recoil';
import { AppTable } from '../app-table';
import { GeoJsonEditor } from '../geojson-editor';
import { IconFont } from '../iconfont';
import { WktEditor } from '../wkt-editor';
import useStyle from './styles';

export interface MapContentProps {
  features?: Feature[];
  tabItems?: TabsProps['items'];
}

export const MapContent: React.FC<MapContentProps> = ({
  features,
  tabItems,
}) => {
  const { activeTab, setActiveTab, coordConvert, setCoordConvert } =
    useGlobal();
  const { saveEditorText } = useFeature();
  const { t } = useTranslation();
  const styles = useStyle();

  useEffect(() => {
    if (features) {
      saveEditorText(
        JSON.stringify({ type: 'FeatureCollection', features }, null, 2),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  const defaultTabItems: TabsProps['items'] = [
    {
      key: 'geojson',
      icon: <IconFont type="icon-json" />,
      label: 'GeoJSON',
      children: <GeoJsonEditor />,
    },
    {
      key: 'wkt',
      icon: <GlobalOutlined />,
      label: 'WKT',
      children: <WktEditor />,
    },
    {
      key: 'table',
      icon: <TableOutlined />,
      label: t('app_header.constants.biaoGe'),
      children: <AppTable />,
    },
  ];

  return (
    <div className={styles.mapContent} id="l7-editor-panel">
      <div className={styles.mapContentSelect}>
        <span className={styles.mapContentSelectLabel}>
          {t('map_content.index.zuoBiaoXi')}
        </span>
        <Select
          value={coordConvert}
          options={[
            { label: 'GCJ02', value: 'GCJ02' },
            { label: 'WGS84', value: 'WGS84' },
          ]}
          onChange={setCoordConvert}
        />
      </div>
      <Tabs
        //@ts-ignore
        activeKey={activeTab === 'code' ? 'geojson' : activeTab}
        className={styles.mapContentRight}
        defaultActiveKey="geojson"
        items={tabItems ? tabItems : defaultTabItems}
        onChange={(e) => {
          setActiveTab(e as 'geojson' | 'table' | 'wkt');
        }}
      />
    </div>
  );
};
