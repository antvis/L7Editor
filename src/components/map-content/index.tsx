import { CodeOutlined, TableOutlined } from '@ant-design/icons';
import { FeatureCollection } from '@turf/turf';
import { Tabs, TabsProps } from 'antd';
import React, { useEffect } from 'react';
import { useFeature, useGlobal } from '../../recoil';
import { AppEditor } from '../app-editor';
import { AppTable } from '../app-table';
import { WktEditor } from '../wkt-editor';
import './index.less';
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
      key: 'geojson',
      label: (
        <div>
          <CodeOutlined style={{ marginLeft: 5 }} />
          编辑器
        </div>
      ),
      children: <AppEditor />,
    },
    {
      key: 'table',
      label: (
        <div id="l7-editor-driver-table">
          <TableOutlined style={{ marginLeft: 5 }} />
          表格
        </div>
      ),
      children: <AppTable />,
    },
    {
      key: 'wkt',
      label: <div>wkt编辑器</div>,
      children: <WktEditor />,
    },
  ];

  return (
    <div className={styles.mapContent} id="l7-editor-driver-panel">
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
