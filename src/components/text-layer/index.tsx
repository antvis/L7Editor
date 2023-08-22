import { TextLayer, TextLayerProps } from '@antv/larkmap';
import { center } from '@turf/turf';
import React, { useMemo } from 'react';
import { useFeature, useGlobal } from '../../recoil';

export const EditorTextLayer = () => {
  const { features, transformCoord } = useFeature();
  const { coordConvert, layerColor } = useGlobal();
  const transformData = useMemo(() => {
    const data = features.map((item) => {
      return center(item);
    });
    return data;
  }, [features]);

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
        textAllowOverlap: false,
        padding: [10, 10] as [number, number],
        textOffset: [0, -18],
      },
    };
  }, [layerColor]);

  const sourceData = useMemo(() => {
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
  }, [transformData, coordConvert]);
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
