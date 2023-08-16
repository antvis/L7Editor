import { GlobalOutlined, TableOutlined } from '@ant-design/icons';
import { Feature } from '@turf/turf';
import { Select, Tabs, TabsProps } from 'antd';
import React, { useEffect } from 'react';
import { IconFont } from '../../constants';
import { useFeature, useGlobal } from '../../recoil';
import { AppTable } from '../app-table';
import { GeoJsonEditor } from '../geojson-editor';
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
  const styles = useStyle();

  useEffect(() => {
    if (features) {
      saveEditorText(
        JSON.stringify({ type: 'FeatureCollection', features }, null, 2),
      );
    }
  }, [features]);

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
        items={tabItems}
        onChange={(e) => {
          setActiveTab(e as 'geojson' | 'table' | 'wkt');
        }}
      />
    </div>
  );
};

MapContent.defaultProps = {
  tabItems: [
    {
      key: 'geojson',
      label: (
        <div>
          <IconFont type="icon-json" />
          GeoJSON
        </div>
      ),
      children: <GeoJsonEditor />,
    },
    {
      key: 'wkt',
      label: (
        <div id="l7-editor-wkt">
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
  ],
};
