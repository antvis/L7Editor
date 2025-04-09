import type { PolygonLayerProps } from '@antv/larkmap';
import {
  ImageLayer,
  LineLayer,
  PointLayer,
  PolygonLayer,
  useScene,
} from '@antv/larkmap';
import type { Feature } from '@turf/turf';
import { useAsyncEffect } from 'ahooks';
import Color from 'color';
import { cloneDeep, flattenDeep, groupBy } from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';
import { FeatureKey, LayerId, LayerZIndex } from '../../constants';
import { useFilterFeatures } from '../../hooks';
import { useFeature, useGlobal } from '../../recoil';
import { getPointImage } from '../../utils/change-image-color';
import { EditorTextLayer } from '../text-layer';

export const LayerList: React.FC = () => {
  const scene = useScene();
  const [isMounted, setIsMounted] = useState(false);
  const { layerColor, coordConvert, baseMap, showTextLayer } = useGlobal();
  const { transformCoord, imageMask } = useFeature();
  const { features: newFeatures } = useFilterFeatures();
  const [features, setFeatures] = useState<Feature[]>([]);
  const imageMaskData = JSON.parse(imageMask);

  useEffect(() => {
    if (newFeatures.length) {
      setFeatures(transformCoord(newFeatures));
    } else {
      setFeatures([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFeatures, coordConvert, baseMap]);

  const [
    pointSource,
    lineSource,
    polygonSource,
  ]: PolygonLayerProps['source'][] = useMemo(() => {
    const {
      Polygon: polygonList = [],
      LineString: lineStringList = [],
      Point: pointList = [],
    }: Record<string, Feature[]> = groupBy(
      cloneDeep(features).filter((feature) => {
        // @ts-ignore
        return !feature.properties?.[FeatureKey.IsEdit];
      }),
      (feature: Feature) => feature.geometry.type.replace('Multi', ''),
    );

    return [pointList, lineStringList, polygonList].map((typeFeatures) => {
      return {
        data: { type: 'FeatureCollection', features: typeFeatures },
      };
    });
  }, [features]);

  useAsyncEffect(async () => {
    const newLayerColor = Color(layerColor).rgb().object();
    const imag2color = await getPointImage(newLayerColor, { x: 100, y: 100 });
    const imagColor = await getPointImage(newLayerColor, { x: 400, y: 400 });
    scene.addImage('drawImg', imagColor);
    scene.addImage('pointIcon', imag2color);
    setIsMounted(true);
  }, [layerColor]);

  const activeColor = useMemo(() => {
    const newLayerColor = Color(layerColor).darken(0.3).hex();
    return newLayerColor;
  }, [layerColor]);

  return isMounted ? (
    <>
      <PolygonLayer
        id={LayerId.PolygonLayer}
        source={polygonSource}
        blend="normal"
        shape="fill"
        color={layerColor}
        style={{ opacity: 0.15 }}
        state={{ active: { color: activeColor } }}
        zIndex={LayerZIndex}
      />
      <PolygonLayer
        source={polygonSource}
        shape="line"
        blend="normal"
        color={layerColor}
        size={2}
        zIndex={LayerZIndex}
      />
      <LineLayer
        id={LayerId.LineLayer}
        source={lineSource}
        blend="normal"
        color={layerColor}
        size={2}
        state={{ active: { color: activeColor } }}
        zIndex={LayerZIndex}
      />
      <PointLayer
        id={LayerId.PointLayer}
        source={pointSource}
        blend="normal"
        size={20}
        shape="pointIcon"
        //@ts-ignore
        style={{ offsets: [0, 20] }}
        state={{ active: { color: activeColor } }}
        zIndex={LayerZIndex}
      />
      {showTextLayer && <EditorTextLayer />}
      {imageMaskData?.file && (
        <ImageLayer
          source={{
            data: JSON.parse(imageMaskData.file).url,
            parser: {
              type: 'image',
              extent: flattenDeep(
                imageMaskData.text
                  .split(';')
                  .map((item: string) => item.split(',').map(Number)),
              ),
            },
          }}
        />
      )}
    </>
  ) : null;
};
