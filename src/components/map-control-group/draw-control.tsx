import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DrawControl as L7DrawControl, DrawEvent } from '@antv/l7-draw';
import { useScene } from '@antv/larkmap';
import { useModel } from 'umi';
import { Feature } from '@turf/turf';
import { FeatureKey } from '@/constants';
import { DrawType } from '@antv/larkmap/es/components/Draw/types';
import { cloneDeep, fromPairs, merge } from 'lodash';

const DrawControl = () => {
  const scene = useScene();
  const [drawControl, setDrawControl] = useState<L7DrawControl | null>(null);
  const { resetFeatures, features } = useModel('feature');
  const { layerColor } = useModel('global');
  const editFeature = useMemo(
    () =>
      cloneDeep(
        features.find(
          // @ts-ignore
          (feature) => feature.properties[FeatureKey.IsEdit],
        ),
      ),
    [features],
  );

  useEffect(() => {
    let newDrawControl: L7DrawControl | undefined;
    if (scene) {
      const commonStyle = {
        normal: {
          color: layerColor,
        },
        hover: {
          color: layerColor,
        },
        active: {
          color: layerColor,
        },
      };
      newDrawControl = new L7DrawControl(scene, {
        position: 'topleft',
        drawConfig: {
          point: true,
          line: true,
          polygon: true,
          rect: true,
          circle: true,
        },
        commonDrawOptions: {
          maxCount: 1,
          style: {
            point: commonStyle,
            line: commonStyle,
            polygon: merge({}, commonStyle, {
              normal: {
                style: {
                  opacity: 0.5,
                },
              },
              hover: {
                style: {
                  opacity: 0.5,
                },
              },
              active: {
                style: {
                  opacity: 0.5,
                },
              },
            }),
            dashLine: commonStyle,
            midPoint: commonStyle,
          },
        },
      });
      setDrawControl(newDrawControl);
      scene.addControl(newDrawControl);
    }

    return () => {
      if (newDrawControl) {
        scene.removeControl(newDrawControl);
      }
    };
  }, [scene, layerColor]);

  const onDrawAdd = useCallback(
    (drawType: DrawType, newFeature: Feature) => {
      newFeature.properties = {
        [FeatureKey.DrawType]: drawType,
      };
      drawControl?.clearDrawData();
      drawControl?.setActiveType(null);
      resetFeatures([...features, newFeature]);
    },
    [resetFeatures, features, drawControl],
  );

  const onDrawEdit = useCallback(
    (drawType: DrawType, feature: Feature) => {
      // @ts-ignore
      const index = feature.properties[FeatureKey.Index];
      const newFeatures = [...features];
      // @ts-ignore
      newFeatures[index].properties[FeatureKey.IsEdit] = false;
      newFeatures[index].geometry = feature.geometry;
      drawControl?.clearDrawData();
      drawControl?.setActiveType(null);
      resetFeatures([...features]);
    },
    [resetFeatures, features, drawControl],
  );

  useEffect(() => {
    const drawTypeList: DrawType[] = [
      'point',
      'line',
      'polygon',
      'rect',
      'circle',
    ];
    const onDrawAddMap = fromPairs(
      drawTypeList.map((drawType) => [
        drawType,
        {
          onAdd: (newFeature: Feature) => onDrawAdd(drawType, newFeature),
          onEdit: (newFeature: Feature) => onDrawEdit(drawType, newFeature),
        },
      ]),
    );

    drawTypeList.forEach((drawType: any) => {
      const draw = drawControl?.getTypeDraw(drawType);
      draw?.on(DrawEvent.Add, onDrawAddMap[drawType].onAdd);
      draw?.on(DrawEvent.Edit, onDrawAddMap[drawType].onEdit);
    });

    return () => {
      drawTypeList.forEach((drawType: any) => {
        const draw = drawControl?.getTypeDraw(drawType);
        draw?.off(DrawEvent.Add, onDrawAddMap[drawType].onAdd);
        draw?.off(DrawEvent.Edit, onDrawAddMap[drawType].onEdit);
      });
    };
  }, [drawControl, onDrawAdd]);

  useEffect(() => {
    if (editFeature && drawControl) {
      // @ts-ignore
      const drawType = editFeature.properties?.[FeatureKey.DrawType];
      // @ts-ignore
      editFeature.properties.isActive = true;
      drawControl.setActiveType(drawType);
      const targetDraw = drawControl.getTypeDraw(drawType);
      targetDraw?.setData([editFeature]);
    }
  }, [editFeature, drawControl]);

  return <></>;
};

export default DrawControl;
