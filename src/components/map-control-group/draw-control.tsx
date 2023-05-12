import { FeatureKey } from '@/constants';
import { EditOutlined } from '@ant-design/icons';
import {
  ControlEvent,
  DrawControl as L7DrawControl,
  DrawEvent,
  getSingleColorStyle,
} from '@antv/l7-draw';
import { CustomControl, useScene } from '@antv/larkmap';
import { DrawType } from '@antv/larkmap/es/components/Draw/types';
import { Feature } from '@turf/turf';
import { cloneDeep, fromPairs } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

const DrawControl = () => {
  const scene = useScene();
  const [drawControl, setDrawControl] = useState<L7DrawControl | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { resetFeatures, features, setIsDraw } = useModel('feature');
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
      newDrawControl = new L7DrawControl(scene, {
        position: 'topleft',
        drawConfig: {
          point: isVisible,
          line: isVisible,
          polygon: isVisible,
          rect: isVisible,
          circle: isVisible,
        },
        commonDrawOptions: {
          maxCount: 1,
          style: getSingleColorStyle(layerColor!),
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
  }, [scene, layerColor, isVisible]);

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

  return (
    <CustomControl position="topleft" style={{ display: 'flex' }}>
      <div className="l7-draw-switch">
        <button
          className="l7-draw-control__btn"
          style={{ borderRight: 'none' }}
        >
          <EditOutlined
            className="l7-draw-icon"
            style={{ fontSize: 16, lineHeight: '30px' }}
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          />
        </button>
      </div>
      <div id="l7-draw-content" />
    </CustomControl>
  );
};

export default DrawControl;
