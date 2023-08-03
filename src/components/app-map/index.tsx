//@ts-ignore
import { useFeature, useGlobal } from '@/recoil';
import { LarkMap } from '@antv/larkmap';
import { useMount } from 'ahooks';
import { message } from 'antd';
import { omit } from 'lodash';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { FeatureCollectionVT, MapBoxConfig } from '../../constants';
import { getParamsNew, getUrlFeatureCollection } from '../../utils';
import { prettierText } from '../../utils/prettier-text';

export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions: baseMapOptions, baseMap } = useGlobal();
  const { saveEditorText, editorText, scene, setScene, bboxAutoFit } =
    useFeature();

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

  const mapOptions = useMemo(() => {
    if (baseMap === 'Mapbox') {
      return {
        ...baseMapOptions,
        ...MapBoxConfig,
      };
    }
    return omit(baseMapOptions, ['token']);
  }, [baseMap, baseMapOptions]);

  return (
    <LarkMap
      style={{ height: '100%' }}
      mapOptions={mapOptions}
      mapType={baseMap}
      onSceneLoaded={setScene}
    >
      {children}
    </LarkMap>
  );
};
