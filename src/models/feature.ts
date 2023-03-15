import { FeatureKey, LocalstorageKey } from '@/constants';
import { transformFeatures } from '@/utils';
import {
  Feature,
  featureCollection,
  Geometry,
  GeometryCollection,
  getType,
} from '@turf/turf';
import { useLocalStorageState, useMount } from 'ahooks';
import { message } from 'antd';
import { flatMap, max, min } from 'lodash';
import { useMemo, useState } from 'react';

export default () => {
  const [editorText, setEditorText] = useLocalStorageState(
    LocalstorageKey.EditorText,
    {
      defaultValue: '',
    },
  );
  const [savedText, setSavedText] = useState('');
  const [features, _setFeatures] = useState<
    Feature<
      Geometry | GeometryCollection,
      {
        // @ts-ignore
        [FeatureKey.Index]: number;
      }
    >[]
  >([]);

  const setFeatures = (features: Feature[]) => {
    _setFeatures(
      // @ts-ignore
      features.map((feature, featureIndex) => {
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

  const savable = useMemo(() => {
    return editorText !== savedText;
  }, [editorText, savedText]);

  const saveEditorText = () => {
    try {
      const features = transformFeatures(editorText);
      setSavedText(editorText);
      setFeatures(features);
      return features;
    } catch (e) {
      message.warn('数据加载有误');
    }
  };

  const resetFeatures = (newFeatures: Feature[]) => {
    const newText = JSON.stringify(featureCollection(newFeatures), null, 2);
    setEditorText(newText);
    setSavedText(newText);
    setFeatures(newFeatures);
  };

  useMount(() => {
    if (editorText) {
      saveEditorText();
    }
  });

  const dataSource: Record<string, string | number>[] = useMemo(() => {
    return features.map((item, index) => {
      const { properties } = item;
      return { __index: index + 1, ...properties };
    });
  }, [features]);

  const featureKeyList = Array.from(
    new Set(flatMap(features.map(({ properties }) => Object.keys(properties)))),
  ).map((field: string) => {
    const type = typeof dataSource[0][field];
    if (type === 'string') {
      const value = dataSource.map((item) => item[field]);
      return { type, field, value };
    }
    if (type === 'number') {
      const value = dataSource.map((item) => item[field]);
      return { type, field, min: min(value), max: max(value) };
    }
  });

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
    featureKeyList,
  };
};
