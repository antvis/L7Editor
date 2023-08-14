import {
  LineLayer,
  PointLayer,
  PolygonLayer,
  PolygonLayerProps,
  useScene,
} from '@antv/larkmap';
import { Feature } from '@turf/turf';
import { useAsyncEffect } from 'ahooks';
import Color from 'color';
import gcoord from 'gcoord';
import { cloneDeep, groupBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { FeatureKey, LayerId, LayerZIndex } from '../../constants';
import { Features, useFilterFeature } from '../../hooks/useFilterFeature';
import { useGlobal } from '../../recoil';
import { getPointImage } from '../../utils/change-image-color';

export const LayerList: React.FC = () => {
  const scene = useScene();
  const [isMounted, setIsMounted] = useState(false);
  const { layerColor, coordConvert, baseMap } = useGlobal();
  const { newFeatures } = useFilterFeature();
  const [features, setFeatures] = useState<Features[]>([]);

  useEffect(() => {
    if (newFeatures.length) {
      let data = newFeatures;
      if (coordConvert === 'WGS84' && baseMap === 'Gaode') {
        //@ts-ignore
        data = newFeatures.map((item) => {
          const newItem = gcoord.transform(
            //@ts-ignore
            cloneDeep(item),
            gcoord.WGS84,
            gcoord.GCJ02,
          );
          return newItem;
        });
        //@ts-ignore
      } else if (coordConvert === 'GCJ02' && baseMap === 'Mapbox') {
        //@ts-ignore
        data = newFeatures.map((item) => {
          const newItem = gcoord.transform(
            //@ts-ignore
            cloneDeep(item),
            gcoord.GCJ02,
            gcoord.WGS84,
          );
          return newItem;
        });
      }
      setFeatures(data);
    } else {
      setFeatures([]);
    }
  }, [newFeatures, coordConvert]);

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

    return [pointList, lineStringList, polygonList].map((features) => {
      return {
        data: { type: 'FeatureCollection', features },
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
    </>
  ) : null;
};
