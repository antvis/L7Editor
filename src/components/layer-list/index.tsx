import { FeatureKey, LayerId } from '@/constants';
import { useFilterFeature } from '@/hooks/useFilterFeature';
import { getOpacityColor } from '@/utils';
import {
  LineLayer,
  PointLayer,
  PolygonLayer,
  PolygonLayerProps,
  useScene,
} from '@antv/larkmap';
import { Feature, featureCollection } from '@turf/turf';
import { useAsyncEffect, useMount } from 'ahooks';
import { groupBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import Color from 'color';
import { changeColor } from '@/utils/change-image-color';

export const LayerList: React.FC = () => {
  const scene = useScene();
  const [isMounted, setIsMounted] = useState(false);
  const { layerColor } = useModel('global');
  const { newFeatures } = useFilterFeature();
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
      newFeatures.filter((feature) => {
        // @ts-ignore
        return !feature.properties?.[FeatureKey.IsEdit];
      }),
      (feature: Feature) => feature.geometry.type.replace('Multi', ''),
    );

    return [pointList, lineStringList, polygonList].map((features) => {
      return {
        data: featureCollection(features),
      };
    });
  }, [newFeatures]);

  useAsyncEffect(async () => {
    const newLayerColor = Color(layerColor).rgb().object();
    const imag2color = await changeColor(newLayerColor);
    scene.addImage('pointIcon', imag2color);
    setIsMounted(true);
  }, [layerColor]);

  return isMounted ? (
    <>
      <PolygonLayer
        id={LayerId.PolygonLayer}
        source={polygonSource}
        blend="normal"
        shape="fill"
        color={getOpacityColor(layerColor, 0.5)}
      />
      <PolygonLayer
        source={polygonSource}
        shape="line"
        blend="normal"
        color={layerColor}
        size={2}
      />
      <LineLayer
        id={LayerId.LineLayer}
        source={lineSource}
        blend="normal"
        color={layerColor}
        size={2}
      />
      <PointLayer
        id={LayerId.PointLayer}
        source={pointSource}
        blend="normal"
        size={20}
        shape="pointIcon"
      />
    </>
  ) : null;
};
