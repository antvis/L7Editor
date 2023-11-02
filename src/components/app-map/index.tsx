import { LarkMap } from '@antv/larkmap';
import { useMount } from 'ahooks';
import { message } from 'antd';
import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GaodeConfig, MapBoxConfig } from '../../constants';
import { useFeature, useGlobal } from '../../recoil';
import { getParamsNew, getUrlFeatureCollection } from '../../utils';
import { prettierText } from '../../utils/prettier-text';
import useStyle from './styles';
export interface AppMapProps {
  children?: ReactNode;
}

export const AppMap: React.FC<AppMapProps> = ({ children }) => {
  const { mapOptions: baseMapOptions, baseMap } = useGlobal();
  const { saveEditorText, setScene } = useFeature();
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

  const mapOptions = useMemo(() => {
    if (baseMap === 'Mapbox') {
      return {
        ...MapBoxConfig,
        ...baseMapOptions,
      };
    }
    return {
      ...GaodeConfig,
      ...baseMapOptions,
    };
  }, [baseMap, baseMapOptions]);

  return (
    <LarkMap
      className={styles.l7EditorMap}
      mapOptions={mapOptions}
      mapType={baseMap}
      onSceneLoaded={setScene}
      id="l7-editor-map"
      logoVisible={false}
    >
      {children}
    </LarkMap>
  );
};
