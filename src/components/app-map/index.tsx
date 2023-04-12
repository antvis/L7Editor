import { FeatureCollectionVT } from '@/constants';
import { getParamsNew, getUrlFeatureCollection } from '@/utils';
import { prettierText } from '@/utils/prettier-text';
import { LarkMap } from '@antv/larkmap';
import { useMount } from 'ahooks';
import { message } from 'antd';
import React, { ReactNode, useEffect } from 'react';
import { useModel } from 'umi';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions } = useModel('global');
  const { setScene, saveEditorText, editorText } = useModel('feature');

  useMount(async () => {
    const url = getParamsNew('url');
    if (url) {
      try {
        const geoData = await getUrlFeatureCollection(url);
        saveEditorText(prettierText({ content: geoData }));
      } catch (e) {
        message.error(`${e}`);
        saveEditorText(
          JSON.stringify({ type: 'FeatureCollection', features: [] }, null, 2),
        );
      }
    }
  });

  useEffect(() => {
    if (FeatureCollectionVT.check(JSON.parse(editorText))) {
      saveEditorText();
    } else {
      saveEditorText(
        JSON.stringify({ type: 'FeatureCollection', features: [] }, null, 2),
      );
    }
  }, []);

  return (
    <LarkMap
      style={{ height: '100%' }}
      mapOptions={mapOptions}
      onSceneLoaded={setScene}
    >
      {children}
    </LarkMap>
  );
};
