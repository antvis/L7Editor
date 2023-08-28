import { TextLayer, TextLayerProps } from '@antv/larkmap';
import { center } from '@turf/turf';
import React, { useMemo } from 'react';
import { useFeature, useGlobal } from '../../recoil';

export const EditorTextLayer = () => {
  const { features, transformCoord } = useFeature();
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
    const transformData = features.map((item) => {
      return center(item);
    });
    const data = transformCoord(transformData).map((item, index) => {
      return {
        //@ts-ignore
        x: item.geometry.coordinates[0],
        //@ts-ignore
        y: item.geometry.coordinates[1],
        name: `${index + 1}`,
      };
    });
    return data;
  }, [features, coordConvert]);
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
