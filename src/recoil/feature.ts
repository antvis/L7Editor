//@ts-ignore
import { hint } from '@mapbox/geojsonhint';
import type { Feature } from '@turf/turf';
import { bbox, featureCollection, getType } from '@turf/turf';
import { message } from 'antd';
import { cloneDeep, flatMap, max, min } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { FeatureKey } from '../constants';
import type { FilterField, IFeatures } from '../types';
import { gcj02towgs84, transformFeatures, wgs84togcj02 } from '../utils';
import { prettierText } from '../utils/prettier-text';
import {
  editorTextState,
  featureState,
  isDrawState,
  savedTextState,
  sceneState,
} from './atomState';
import useGlobal from './global';

export default function useFeature() {
  const { baseMap, coordConvert } = useGlobal();
  const [editorText, setEditorText] = useRecoilState(editorTextState);
  const [savedText, setSavedText] = useRecoilState(savedTextState);
  const [features, _setFeatures] = useRecoilState(featureState);
  const [isDraw, setIsDraw] = useRecoilState(isDrawState);
  const [scene, setScene] = useRecoilState(sceneState);
  const { t } = useTranslation();

  const savable = useMemo(() => {
    return editorText !== savedText;
  }, [editorText, savedText]);

  const fc = useMemo(() => {
    return featureCollection(features);
  }, [features]);

  const setFeatures = (f: Feature[]) => {
    _setFeatures(
      // @ts-ignore
      cloneDeep(f).map((feature, featureIndex) => {
        feature.properties = {
          ...feature.properties,
          [FeatureKey.Index]: featureIndex,
        };
        // @ts-ignore
        if (!feature.properties?.[FeatureKey.DrawType]) {
          // @ts-ignore
          feature.properties[FeatureKey.DrawType] = (() => {
            const type = getType(feature);
            if (/Point/.test(type)) {
              return 'point';
            }
            if (/LineString/.test(type)) {
              return 'line';
            }
            return 'polygon';
          })();
        }
        return feature;
      }),
    );
  };

  const saveEditorText = (value?: string) => {
    const emptyFeatures = JSON.stringify(
      { type: 'FeatureCollection', features: [] },
      null,
      2,
    );
    let newFeatures: Feature[] = [];
    if (editorText || value) {
      try {
        const errors = hint(JSON.parse(value ?? editorText));
        if (errors.length > 0) {
          message.warning(t('recoil.feature.shuJuJiaZaiYou'));
        } else {
          newFeatures = transformFeatures(value ?? editorText, t);
          if (value) {
            setEditorText(value);
          }
          setSavedText(value ?? editorText);
          setFeatures(newFeatures as IFeatures);
        }
      } catch (error) {
        message.warning(t('recoil.feature.shuJuJiaZaiYou'));
      }
    } else {
      setEditorText(emptyFeatures);
      setSavedText(emptyFeatures);
    }
    return newFeatures;
  };

  const resetFeatures = (newFeatures: IFeatures) => {
    const newText = prettierText({ content: featureCollection(newFeatures) });
    setEditorText(newText);
    setSavedText(newText);
    setFeatures(newFeatures);
  };

  const dataSource = useMemo(() => {
    const data: Record<string, string | number>[] = features.map(
      (item, index) => {
        const { properties } = item;
        return { __index: index + 1, ...properties };
      },
    );
    const featureKeyList: FilterField[] = [];

    Array.from(
      new Set(
        flatMap(features.map(({ properties }) => Object.keys(properties))),
      ),
    ).forEach((field: string) => {
      const type = typeof data[0][field];
      if (type === 'string' || type === 'boolean') {
        const value = data.map((item) => String(item[field])) as string[];
        featureKeyList.push({ type: 'string', field, value });
      } else if (type === 'number') {
        const value = data.map((item) => item[field]);
        featureKeyList.push({
          type,
          field,
          min: min(value) as number,
          max: max(value) as number,
        });
      }
    });
    return featureKeyList;
  }, [features]);

  const transformCoord = useCallback(
    (newFeatures: Feature[]) => {
      let data = [...newFeatures];
      if (coordConvert === 'WGS84' && baseMap === 'Gaode') {
        data = data.map((item) => {
          return wgs84togcj02(cloneDeep(item));
        });
      } else if (coordConvert === 'GCJ02' && baseMap === 'Mapbox') {
        data = data.map((item) => {
          return gcj02towgs84(cloneDeep(item));
        });
      }
      return data;
    },
    [baseMap, coordConvert],
  );

  const revertCoord = useCallback(
    (newFeatures: Feature[]) => {
      let data = [...newFeatures];
      if (coordConvert === 'WGS84' && baseMap === 'Gaode') {
        data = data.map((item) => {
          return gcj02towgs84(cloneDeep(item));
        });
      } else if (coordConvert === 'GCJ02' && baseMap === 'Mapbox') {
        data = data.map((item) => {
          return wgs84togcj02(cloneDeep(item));
        });
      }
      return data;
    },
    [baseMap, coordConvert],
  );

  const bboxAutoFit = useCallback(
    (currentFeatures?: Feature[]) => {
      const realFeatures = currentFeatures ?? features;
      if (scene && realFeatures.length) {
        const [lng1, lat1, lng2, lat2] = bbox(
          featureCollection(transformCoord(realFeatures)),
        );
        scene.fitBounds([
          [lng1, lat1],
          [lng2, lat2],
        ]);
      }
    },
    [features, scene, transformCoord],
  );

  return {
    editorText,
    setEditorText,
    savedText,
    setSavedText,
    features,
    setFeatures,
    savable,
    saveEditorText,
    resetFeatures,
    dataSource,
    bboxAutoFit,
    setIsDraw,
    isDraw,
    scene,
    setScene,
    fc,
    transformCoord,
    revertCoord,
  };
}
