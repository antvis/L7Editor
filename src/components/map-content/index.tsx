import { FeatureCollection } from '@turf/turf';
import { Tabs, TabsProps } from 'antd';
import React, { useEffect } from 'react';
import { useFeature, useGlobal } from '../../recoil';
import './index.less';
import useStyle from './styles';

export interface MapContentProps {
  tabItem: TabsProps['items'];
  feature?: FeatureCollection;
}

export const MapContent: React.FC<MapContentProps> = ({ tabItem, feature }) => {
  const { activeTab, setActiveTab } = useGlobal();
  const { saveEditorText } = useFeature();
  const styles = useStyle();

  useEffect(() => {
    if (feature) {
      saveEditorText(JSON.stringify(feature, null, 2));
    }
  }, [feature]);

  return (
    <div className={styles.mapContent} id="l7-editor-driver-panel">
      <Tabs
        activeKey={activeTab}
        className={styles.mapContentRight}
        defaultActiveKey="geojson"
        items={tabItem}
        onChange={(e) => {
          setActiveTab(e as 'geojson' | 'table');
        }}
      />
    </div>
  );
};
