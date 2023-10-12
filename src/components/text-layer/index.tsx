import { TextLayer, TextLayerProps } from '@antv/larkmap';
import { center } from '@turf/turf';
import React, { useMemo } from 'react';
import { FeatureKey } from '../../constants';
import { useFilterFeatures } from '../../hooks';
import { useFeature, useGlobal } from '../../recoil';

export const EditorTextLayer = () => {
  const { transformCoord } = useFeature();
  const { features: newFeatures } = useFilterFeatures();
  const { coordConvert, layerColor } = useGlobal();

  const layerOptions: Omit<TextLayerProps, 'source'> = useMemo(() => {
    return {
      zIndex: 101,
      field: 'name',
      style: {
        fill: `${layerColor}`,
        opacity: 1,
        fontSize: 18,
        stroke: '#fff',
        strokeWidth: 2,
        textAllowOverlap: true,
        padding: [10, 10] as [number, number],
        textOffset: [0, -18],
      },
    };
  }, [layerColor]);

  const sourceData = useMemo(() => {
    const transformData = transformCoord(newFeatures).map((item) => {
      return {
        data: center(item),
        //@ts-ignore
        featureIndex: item.properties?.[FeatureKey.Index],
      };
    });
    const data = transformData.map((item, index) => {
      return {
        //@ts-ignore
        x: item.data.geometry.coordinates[0],
        //@ts-ignore
        y: item.data.geometry.coordinates[1],
        name: `${item.featureIndex + 1}`,
      };
    });
    return data;
  }, [newFeatures, coordConvert]);
  return (
    <TextLayer
      {...layerOptions}
      source={{
        data: sourceData,
        parser: { type: 'json', x: 'x', y: 'y' },
      }}
    />
  );
};
