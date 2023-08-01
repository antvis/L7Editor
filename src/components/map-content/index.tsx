import { useGlobal } from '@/recoil';
import { Tabs, TabsProps } from 'antd';
import React from 'react';
import './index.less';
import useStyle from './styles';

export interface MapContentProps {
  tabItem: TabsProps['items'];
}

export const MapContent: React.FC<MapContentProps> = ({ tabItem }) => {
  const { activeTab, setActiveTab } = useGlobal();
  const styles = useStyle();

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
