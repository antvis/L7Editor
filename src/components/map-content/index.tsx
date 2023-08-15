import { GlobalOutlined, TableOutlined } from '@ant-design/icons';
import { FeatureCollection } from '@turf/turf';
import { Select, Tabs, TabsProps } from 'antd';
import React, { useEffect } from 'react';
import { IconFont } from '../../constants';
import { useFeature, useGlobal } from '../../recoil';
import { AppEditor } from '../app-editor';
import { AppTable } from '../app-table';
import { WktEditor } from '../wkt-editor';
import useStyle from './styles';

export interface MapContentProps {
  features?: FeatureCollection;
}

export const MapContent: React.FC<MapContentProps> = ({ features }) => {
  const { activeTab, setActiveTab, coordConvert, setCoordConvert } =
    useGlobal();
  const { saveEditorText } = useFeature();
  const styles = useStyle();

  useEffect(() => {
    if (features) {
      saveEditorText(JSON.stringify(features, null, 2));
    }
  }, [features]);

  const items: TabsProps['items'] = [
    {
      key: 'geojson',
      label: (
        <div>
          <IconFont type="icon-json" />
          GeoJSON
        </div>
      ),
      children: <AppEditor />,
    },
    {
      key: 'wkt',
      label: (
        <div>
          <GlobalOutlined />
          WKT
        </div>
      ),
      children: <WktEditor />,
    },
    {
      key: 'table',
      label: (
        <div id="l7-editor-table">
          <TableOutlined />
          表格
        </div>
      ),
      children: <AppTable />,
    },
  ];

  return (
    <div className={styles.mapContent} id="l7-editor-panel">
      <div className={styles.mapContentSelect}>
        <span className={styles.mapContentSelectLabel}>坐标系：</span>
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
        activeKey={activeTab}
        className={styles.mapContentRight}
        defaultActiveKey="geojson"
        items={items}
        onChange={(e) => {
          setActiveTab(e as 'geojson' | 'table' | 'wkt');
        }}
      />
    </div>
  );
};
