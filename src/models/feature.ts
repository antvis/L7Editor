import { FeatureKey, LocalstorageKey } from '@/constants';
import { FilterField } from '@/types/filter';
import { transformFeatures } from '@/utils';
import { prettierText } from '@/utils/prettier-text';
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
    const newText = prettierText({ content: featureCollection(newFeatures) });
    setEditorText(newText);
    setSavedText(newText);
    setFeatures(newFeatures);
  };

  useMount(() => {
    if (editorText) {
      saveEditorText();
    }
  });

  const dataSource = useMemo(() => {
    const data: Record<string, string | number>[] = features.map(
      (item, index) => {
        const { properties } = item;
        return { __index: index + 1, ...properties };
      },
    );
    const featureKeyList: FilterField[] = Array.from(
      new Set(
        flatMap(features.map(({ properties }) => Object.keys(properties))),
      ),
    )
      .map((field: string) => {
        const type = typeof data[0][field];
        if (type === 'string' || type === 'boolean') {
          const value = data.map((item) => String(item[field])) as string[];
          return { type: 'string', field, value };
        } else if (type === 'number') {
          const value = data.map((item) => item[field]);
          return {
            type,
            field,
            min: min(value) as number,
            max: max(value) as number,
          };
        }
      })
      .filter((item) => item);
    return featureKeyList;
  }, [features]);

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
  };
};
