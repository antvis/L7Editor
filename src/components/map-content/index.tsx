import { GlobalOutlined, TableOutlined } from '@ant-design/icons';
import { FeatureCollection } from '@turf/turf';
import { Tabs, TabsProps } from 'antd';
import React, { useEffect } from 'react';
import { IconFont } from '../../constants';
import { useFeature, useGlobal } from '../../recoil';
import { AppEditor } from '../app-editor';
import { AppTable } from '../app-table';
import { WktEditor } from '../wkt-editor';
import useStyle from './styles';

export interface MapContentProps {
  feature?: FeatureCollection;
}

export const MapContent: React.FC<MapContentProps> = ({ feature }) => {
  const { activeTab, setActiveTab } = useGlobal();
  const { saveEditorText } = useFeature();
  const styles = useStyle();

  useEffect(() => {
    if (feature) {
      saveEditorText(JSON.stringify(feature, null, 2));
    }
  }, [feature]);

  const items: TabsProps['items'] = [
    {
      key: 'code',
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
