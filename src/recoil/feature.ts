import { FeatureKey, LocalstorageKey } from '@/constants';
import { FilterField } from '@/types/filter';
import { transformFeatures } from '@/utils';
import { prettierText } from '@/utils/prettier-text';
import { Scene } from '@antv/l7';
import {
  bbox,
  Feature,
  featureCollection,
  Geometry,
  GeometryCollection,
} from '@turf/turf';
import { message } from 'antd';
import { flatMap, max, min } from 'lodash';
import { useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';
import { useDefaultRecoilState } from './atom';

const defaultValue = JSON.stringify(
  { type: 'FeatureCollection', features: [] },
  null,
  2,
);

type IFeature = Feature<
  Geometry | GeometryCollection,
  {
    // @ts-ignore
    [FeatureKey.Index]: number;
  }
>[];

export default function useFeature() {
  const [editorText, setEditorText] = useRecoilState(
    useDefaultRecoilState<string>({
      stateKey: 'editorText',
      storageKey: LocalstorageKey.EditorText,
      storageValue: defaultValue,
    }),
  );

  const [savedText, setSavedText] = useRecoilState(
    atom({
      key: 'savedText',
      default: '',
    }),
  );
  const [features, setFeatures] = useRecoilState(
    atom<IFeature>({
      key: 'features',
      default: [],
    }),
  );
  const [isDraw, setIsDraw] = useRecoilState(
    atom<boolean>({
      key: 'isDraw',
      default: false,
    }),
  );

  const [scene, setScene] = useRecoilState(
    atom<Scene | null>({
      key: 'scene',
      default: null,
    }),
  );

  const savable = useMemo(() => {
    return editorText !== savedText;
  }, [editorText, savedText]);

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
        setFeatures(newFeatures as IFeature);
      } catch (e) {
        message.warn('数据加载有误');
      }
    } else {
      setEditorText(emptyFeatures);
      setSavedText(emptyFeatures);
    }
    return newFeatures;
  };

  const resetFeatures = (newFeatures: IFeature) => {
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

  const bboxAutoFit = (currentFeatures?: Feature[]) => {
    const realFeatures = currentFeatures ?? features;
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
  };
}
