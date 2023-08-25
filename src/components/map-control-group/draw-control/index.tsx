import {
  ControlEvent,
  DrawEvent,
  DrawControl as L7DrawControl,
} from '@antv/l7-draw';
import { CustomControl, useScene } from '@antv/larkmap';
import { DrawType } from '@antv/larkmap/es/components/Draw/types';
import { Feature } from '@turf/turf';
import { cloneDeep, fromPairs } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FeatureKey } from '../../../constants';
import { useFeature, useGlobal } from '../../../recoil';
import { IFeatures } from '../../../types';
import { getDrawStyle } from '../../../utils';
import useStyle from './styles';

const DrawControl = () => {
  const scene = useScene();
  const styles = useStyle();
  const [drawControl, setDrawControl] = useState<L7DrawControl | null>(null);
  const { setIsDraw, resetFeatures, features, revertCoord } = useFeature();
  const { layerColor } = useGlobal();
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
          style: getDrawStyle(layerColor!),
        },
      });
      setDrawControl(newDrawControl);
      scene.addControl(newDrawControl);
      newDrawControl.on(ControlEvent.DrawChange, (newType) => {
        setIsDraw(!!newType);
      });
      const drawDom: any = document.querySelector('.l7-draw-control');
      drawDom.style.marginTop = 0;
      document.querySelector('#l7-draw-content')?.appendChild(drawDom);
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
      const newFeatures = revertCoord([newFeature]);
      resetFeatures([...features, ...newFeatures] as IFeatures);
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
      const revertFeatures = revertCoord(newFeatures);
      resetFeatures([...(revertFeatures as IFeatures)]);
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

  return (
    <CustomControl position="topright">
      <div style={{ display: 'flex' }} id="l7-editor-draw">
        <div className={styles.l7DrawControl}>
          <div id="l7-draw-content" />
        </div>
      </div>
    </CustomControl>
  );
};

export default DrawControl;
