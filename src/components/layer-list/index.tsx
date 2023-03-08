import { FeatureKey, LayerId } from '@/constants';
import { getOpacityColor } from '@/utils';
import {
  LineLayer,
  PointLayer,
  PolygonLayer,
  PolygonLayerProps,
  useScene,
} from '@antv/larkmap';
import { Feature, featureCollection } from '@turf/turf';
import { useMount } from 'ahooks';
import { groupBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useModel } from 'umi';

export const LayerList: React.FC = () => {
  const scene = useScene();
  const [isMounted, setIsMounted] = useState(false);
  const { features } = useModel('feature');
  const { layerColor } = useModel('global');
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
      features.filter((feature) => {
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
  }, [features]);

  useMount(() => {
    scene.addImage(
      'pointIcon',
      'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*mvOqTLxNOEAAAAAAAAAAAAAADmJ7AQ/original',
    );
    setIsMounted(true);
  });

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
        color={layerColor}
        blend="normal"
        size={20}
        shape="pointIcon"
      />
    </>
  ) : null;
};
