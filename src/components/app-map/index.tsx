import { FeatureCollectionVT } from '@/constants';
import { getParamsNew, getUrlFeatureCollection } from '@/utils';
import { prettierText } from '@/utils/prettier-text';
import { LarkMap } from '@antv/larkmap';
import { useMount } from 'ahooks';
import { message } from 'antd';
import { omit } from 'lodash';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { useModel } from 'umi';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions, baseMap } = useModel('global');
  const { setScene, saveEditorText, editorText, bboxAutoFit, scene } =
    useModel('feature');

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
    if (scene) {
      bboxAutoFit();
    }
  }, [scene]);

  useEffect(() => {
    try {
      if (FeatureCollectionVT.check(JSON.parse(editorText!))) {
        saveEditorText();
      }
    } catch {
      saveEditorText(
        JSON.stringify({ type: 'FeatureCollection', features: [] }, null, 2),
      );
    }
  }, []);

  const newMapOptions = useMemo(() => {
    if (baseMap === 'Mapbox') {
      return {
        ...mapOptions,
        style: 'mapbox://styles/zcxduo/ck2ypyb1r3q9o1co1766dex29',
        token:
          'pk.eyJ1IjoibGl1dmlnb25nenVvc2hpIiwiYSI6ImNsaGs2czBrcTBvczUzbnFzOHU0dzk2ZWQifQ.hVvTgcbg_Ym-VQz36psLRg',
      };
    }
    return omit(mapOptions, ['token']);
  }, [baseMap, mapOptions]);
  console.log(newMapOptions, 'newMapOptions');
  return (
    <LarkMap
      style={{ height: '100%' }}
      mapOptions={newMapOptions}
      mapType={baseMap}
      onSceneLoaded={setScene}
    >
      {children}
    </LarkMap>
  );
};
