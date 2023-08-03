//@ts-ignore
import { useFeature, useGlobal } from '@/recoil';
import { Tabs, TabsProps } from 'antd';
import React, { useEffect } from 'react';
import { IFeature } from '../../types';
import './index.less';
import useStyle from './styles';

export interface MapContentProps {
  tabItem: TabsProps['items'];
  feature?: IFeature;
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
    <div className={styles.mapContent}>
      <Tabs
        activeKey={activeTab}
        className={styles.mapContentRight}
        defaultActiveKey="code"
        items={tabItem}
        onChange={(e) => {
          setActiveTab(e as 'code' | 'table');
        }}
      />
    </div>
  );
};
