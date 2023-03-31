import { FeatureKey, LayerId } from '@/constants';
import { Popup, PopupProps, useLayerList } from '@antv/larkmap';
import { Button, Descriptions, Empty, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './index.less';
import { useModel } from 'umi';
import { isCircle, isRect } from '@/utils';
const { Paragraph } = Typography;

export const LayerPopup: React.FC = () => {
  const { resetFeatures, features } = useModel('feature');
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

  const onLayerClick = useCallback(
    (e: any) => {
      console.log(isRect(e.feature));
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
    },
    [setPopupProps, popupProps],
  );

  const onLayerMouseenter = useCallback(
    (e: any) => {
      const { lngLat, feature } = e;
      const featureIndex = feature.properties[FeatureKey.Index];
      setPopupProps({
        lngLat,
        visible: true,
        featureIndex,
      });
    },
    [setPopupProps, popupProps],
  );
  const onLayerMouseout = useCallback(() => {
    setPopupProps((oldPopupProps) => {
      return {
        ...oldPopupProps,
        visible: false,
        featureIndex: undefined,
      };
    });
  }, [setPopupProps, popupProps]);

  useEffect(() => {
    if (popupTrigger === 'click') {
      layerList.forEach((layer) => layer.on('click', onLayerClick));
      return () => {
        layerList.forEach((layer) => layer.off('click', onLayerClick));
      };
    } else {
      layerList.forEach((layer) => layer.on('mouseenter', onLayerMouseenter));
      layerList.forEach((layer) => layer.on('mouseout', onLayerMouseout));
      return () => {
        layerList.forEach((layer) =>
          layer.off('mouseenter', onLayerMouseenter),
        );
        layerList.forEach((layer) => layer.off('mouseout', onLayerMouseout));
      };
    }
  }, [onLayerClick, layerList, popupTrigger]);

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
                {/*<Button*/}
                {/*  type="primary"*/}
                {/*  size="small"*/}
                {/*  onClick={() => {*/}
                {/*    const newFeatures = [...features];*/}
                {/*    // @ts-ignore*/}
                {/*    newFeatures[popupProps.featureIndex].properties[*/}
                {/*      FeatureKey.IsEdit*/}
                {/*    ] = true;*/}
                {/*    resetFeatures(newFeatures);*/}
                {/*    setPopupProps({*/}
                {/*      visible: false,*/}
                {/*      featureIndex: undefined,*/}
                {/*    });*/}
                {/*  }}*/}
                {/*>*/}
                {/*  编辑*/}
                {/*</Button>*/}
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
              </div>
            </div>
          </Popup>
        )}
    </>
  );
};
