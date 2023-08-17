import {
  bbox,
  Feature,
  featureCollection,
  getType,
} from '@turf/turf';
import { message } from 'antd';
import gcoord from 'gcoord';
import { cloneDeep, flatMap, max, min } from 'lodash-es';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { FeatureKey } from '../constants';
import { FilterField, IFeatures } from '../types';
import { transformFeatures } from '../utils';
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
        newFeatures = transformFeatures(value ?? editorText);
        if (value) {
          setEditorText(value);
        }
        setSavedText(value ?? editorText);
        setFeatures(newFeatures as IFeatures);
      } catch (e) {
        message.warning('数据加载有误');
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

  const transformCoord = (features: Feature[]) => {
    let data = features;
    if (coordConvert === 'WGS84' && baseMap === 'Gaode') {
      data = features.map((item) => {
        const newItem = gcoord.transform(
          cloneDeep(item as any),
          gcoord.WGS84,
          gcoord.GCJ02,
        );
        return newItem;
      });
    } else if (coordConvert === 'GCJ02' && baseMap === 'Mapbox') {
      data = features.map((item) => {
        const newItem = gcoord.transform(
          cloneDeep(item as any),
          gcoord.GCJ02,
          gcoord.WGS84,
        );
        return newItem;
      });
    }
    return data;
  };

  const bboxAutoFit = (currentFeatures?: Feature[]) => {
    const realFeatures = transformCoord(currentFeatures ?? features);

    if (scene && realFeatures.length) {
      const [lng1, lat1, lng2, lat2] = bbox(featureCollection(realFeatures));
      scene.fitBounds([
        [lng1, lat1],
        [lng2, lat2],
      ]);
    }
  };

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
  };
}
