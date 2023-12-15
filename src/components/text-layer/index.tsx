import type { TextLayerProps } from '@antv/larkmap';
import { TextLayer } from '@antv/larkmap';
import type { Feature, LineString } from '@turf/turf';
import { center } from '@turf/turf';
import { cloneDeep } from 'lodash-es';
import React, { useMemo } from 'react';
import { FeatureKey } from '../../constants';
import { useFilterFeatures } from '../../hooks';
import { useFeature, useGlobal } from '../../recoil';
import { centerOfLine } from '../../utils';

export const EditorTextLayer = () => {
  const { transformCoord } = useFeature();
  const { features: newFeatures } = useFilterFeatures();
  const { layerColor, textLayerFields } = useGlobal();

  const textOptions: Omit<TextLayerProps, 'source'> = useMemo(() => {
    return {
      zIndex: 101,
      field: 'text',
      style: {
        fill: `${layerColor}`,
        opacity: 1,
        fontSize: 16,
        stroke: '#fff',
        strokeWidth: 2,
        textAllowOverlap: true,
        padding: [10, 10] as [number, number],
      },
    };
  }, [layerColor]);

  const pointTextOptions: Omit<TextLayerProps, 'source'> = useMemo(() => {
    const newLayerOptions = cloneDeep(textOptions);
    newLayerOptions.style!.textOffset = [0, -20];
    return newLayerOptions;
  }, [textOptions]);

  const sourceData = useMemo(() => {
    const data = transformCoord(newFeatures).map((item) => {
      // @ts-ignore
      const featureIndex = item.properties?.[FeatureKey.Index];
      const [x, y] = (() => {
        if (item.geometry.type === 'LineString') {
          return centerOfLine(item as Feature<LineString>).geometry.coordinates;
        }
        if (item.geometry.type === 'Point') {
          return item.geometry.coordinates;
        } else {
          return center(item).geometry.coordinates;
        }
      })();

      let text = `${featureIndex + 1}`;

      if (textLayerFields?.length) {
        text = textLayerFields
          .map((field) => {
            return String(item.properties?.[field] ?? '');
          })
          .join(' ');
      }

      return {
        x,
        y,
        text,
        type: item.geometry.type,
      };
    });
    return data;
  }, [transformCoord, newFeatures, textLayerFields]);

  return (
    <>
      <TextLayer
        {...textOptions}
        source={{
          data: sourceData.filter((item) => item.type !== 'Point'),
          parser: { type: 'json', x: 'x', y: 'y' },
        }}
      />
      <TextLayer
        {...pointTextOptions}
        source={{
          data: sourceData.filter((item) => item.type === 'Point'),
          parser: { type: 'json', x: 'x', y: 'y' },
        }}
      />
    </>
  );
};
