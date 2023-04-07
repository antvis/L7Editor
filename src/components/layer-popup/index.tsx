import { FeatureKey, LayerId } from '@/constants';
import { isCircle, isRect } from '@/utils';
import { prettierText } from '@/utils/prettier-text';
import {
  DrawCircle,
  DrawEvent,
  DrawLine,
  DrawPoint,
  DrawPolygon,
  DrawRect,
} from '@antv/l7-draw';
import { Popup, PopupProps, useLayerList, useScene } from '@antv/larkmap';
import { featureCollection } from '@turf/turf';
import { Button, Descriptions, Empty, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import './index.less';
const { Paragraph } = Typography;

export const LayerPopup: React.FC = () => {
  const scene = useScene();
  const {
    resetFeatures,
    features,
    setFeatures,
    setEditorText,
    isDraw,
    setIsDraw,
  } = useModel('feature');
  const { popupTrigger } = useModel('global');
  const [popupProps, setPopupProps] = useState<
    PopupProps & { visible: boolean; featureIndex?: number }
  >({
    lngLat: {
      lng: 0,
      lat: 0,
    },
    visible: false,
  });
  const [clickFeature, setClickFeature] = useState<any>(null);

  const targetFeature = useMemo(() => {
    return features.find(
      (feature) =>
        // @ts-ignore
        feature.properties?.[FeatureKey.Index] === popupProps.featureIndex,
    );
  }, [features, popupProps]);
  const featureFields = Object.entries(targetFeature?.properties ?? {});
  const allLayerList = useLayerList();
  const layerList = useMemo(() => {
    const layerIds: string[] = [
      LayerId.PointLayer,
      LayerId.LineLayer,
      LayerId.PolygonLayer,
    ];
    return allLayerList.filter((layer) => {
      return layerIds.includes(layer.id);
    });
  }, [allLayerList]);

  const disabledEdit = useMemo(() => {
    const reg = RegExp(/Multi/);
    if (clickFeature) {
      return reg.test(clickFeature.geometry.type);
    }
    return false;
  }, [clickFeature]);

  const onLayerClick = useCallback(
    (e: any) => {
      if (!isDraw) {
        setClickFeature(e.feature);
        const { lngLat, feature } = e;
        const featureIndex = feature.properties[FeatureKey.Index];
        if (
          popupProps.visible &&
          popupProps.featureIndex === feature.properties[FeatureKey.Index]
        ) {
          setPopupProps((oldPopupProps) => {
            return {
              ...oldPopupProps,
              visible: false,
              featureIndex: undefined,
            };
          });
        } else {
          setPopupProps({
            lngLat,
            visible: true,
            featureIndex,
          });
        }
      }
    },
    [setPopupProps, popupProps, isDraw],
  );

  const onLayerMouseenter = useCallback(
    (e: any) => {
      if (!isDraw) {
        const { lngLat, feature } = e;
        const featureIndex = feature.properties[FeatureKey.Index];
        setPopupProps({
          lngLat,
          visible: true,
          featureIndex,
        });
      }
    },
    [setPopupProps, popupProps, isDraw],
  );

  const onLayerMouseout = useCallback(() => {
    if (!isDraw) {
      setPopupProps((oldPopupProps) => {
        return {
          ...oldPopupProps,
          visible: false,
          featureIndex: undefined,
        };
      });
    }
  }, [setPopupProps, popupProps, isDraw]);

  const onEdit = () => {
    if (clickFeature) {
      setIsDraw(true);
      const newFeatures = features.filter((item: any) => {
        return (
          item.properties[FeatureKey.Index] !==
          clickFeature.properties?.[FeatureKey.Index]
        );
      });
      const index = features.findIndex((v: any) => {
        return (
          v.properties[FeatureKey.Index] ===
          clickFeature.properties?.[FeatureKey.Index]
        );
      });
      const onChange = (v: any, draw: any) => {
        if (!v) {
          const newData = {
            ...draw.getData()[0],
            properties: clickFeature?.properties,
          };
          features.splice(index, 1, newData);
          setFeatures(features);
          setEditorText(prettierText({ content: featureCollection(features) }));
          draw.destroy();
          setIsDraw(false);
        }
      };
      const options = {
        initialData: [clickFeature],
        multiple: false,
        maxCount: 1,
        autoActive: true,
        editable: true,
      };
      const type = clickFeature?.geometry.type;
      let drawLayer: any;
      if (type === 'Point') {
        drawLayer = new DrawPoint(scene, {
          ...options,
          style: {
            point: {
              normal: { shape: 'pointIcon', size: 20 },
              hover: { shape: 'pointIcon', size: 20 },
              active: { shape: 'pointIcon', size: 20 },
            },
          },
        });
      } else if (type === 'LineString') {
        drawLayer = new DrawLine(scene, options);
      } else if (type === 'Polygon' && isRect(clickFeature)) {
        drawLayer = new DrawRect(scene, options);
      } else if (type === 'Polygon' && isCircle(clickFeature)) {
        drawLayer = new DrawCircle(scene, options);
      } else {
        drawLayer = new DrawPolygon(scene, options);
      }
      drawLayer.enable();
      setFeatures(newFeatures);
      drawLayer.on(DrawEvent.Select, (v: any) => onChange(v, drawLayer));
      setPopupProps({
        visible: false,
        featureIndex: undefined,
      });
    }
  };

  useEffect(() => {
    if (popupTrigger === 'click') {
      layerList.forEach((layer) => layer.on('click', onLayerClick));
      return () => {
        layerList.forEach((layer) => layer.off('click', onLayerClick));
      };
    } else if (popupTrigger === 'hover') {
      layerList.forEach((layer) => layer.on('mouseenter', onLayerMouseenter));
      layerList.forEach((layer) => layer.on('mouseout', onLayerMouseout));
      return () => {
        layerList.forEach((layer) =>
          layer.off('mouseenter', onLayerMouseenter),
        );
        layerList.forEach((layer) => layer.off('mouseout', onLayerMouseout));
      };
    }
  }, [onLayerClick, layerList, popupTrigger, scene]);

  return (
    <>
      {popupProps.visible &&
        typeof popupProps.featureIndex === 'number' &&
        targetFeature && (
          <Popup
            lngLat={popupProps.lngLat}
            closeButton={false}
            followCursor={popupTrigger === 'hover' ? true : false}
          >
            <div
              className="layer-popup"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {featureFields.length ? (
                <div
                  className="layer-popup__info"
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Descriptions size="small" bordered column={1}>
                    {featureFields.map(([key, value]) => {
                      if (!(value instanceof Object)) {
                        return (
                          <Descriptions.Item label={key} key={key}>
                            <Paragraph copyable>{String(value)}</Paragraph>
                          </Descriptions.Item>
                        );
                      }
                    })}
                  </Descriptions>
                </div>
              ) : (
                <Empty
                  description="当前元素无字段"
                  style={{ margin: '12px 0' }}
                />
              )}
              <div className="layer-popup__btn-group">
                {popupTrigger === 'click' && (
                  <Button
                    size="small"
                    type="link"
                    danger
                    onClick={() => {
                      resetFeatures(
                        features.filter((_, index) => {
                          return index !== popupProps.featureIndex;
                        }),
                      );
                      setPopupProps({
                        visible: false,
                        featureIndex: undefined,
                      });
                    }}
                  >
                    删除
                  </Button>
                )}
                {popupTrigger === 'click' && (
                  <Button
                    size="small"
                    type="link"
                    onClick={onEdit}
                    disabled={disabledEdit}
                  >
                    编辑
                  </Button>
                )}
              </div>
            </div>
          </Popup>
        )}
    </>
  );
};
