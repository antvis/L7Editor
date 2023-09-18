import { LarkMap } from '@antv/larkmap';
import { useMount } from 'ahooks';
import { message } from 'antd';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureCollectionVT, MapBoxConfig } from '../../constants';
import { useFeature, useGlobal } from '../../recoil';
import { getParamsNew, getUrlFeatureCollection } from '../../utils';
import { prettierText } from '../../utils/prettier-text';
import useStyle from './styles';
export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions: baseMapOptions, baseMap } = useGlobal();
  const { saveEditorText, editorText, scene, setScene, bboxAutoFit } =
    useFeature();
  const styles = useStyle();
  const { t } = useTranslation();

  useMount(async () => {
    const url = getParamsNew('url');
    if (url) {
      try {
        const geoData = await getUrlFeatureCollection(url, 'GeoJSON', t);
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
      return MapBoxConfig;
    }
    return baseMapOptions;
  }, [baseMap, baseMapOptions]);

  return (
    <LarkMap
      className={styles.l7EditorMap}
      mapOptions={mapOptions}
      mapType={baseMap}
      onSceneLoaded={setScene}
      id="l7-editor-map"
    >
      {children}
    </LarkMap>
  );
};
