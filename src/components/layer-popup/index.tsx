import { FeatureKey, LayerId } from '@/constants';
import { Popup, PopupProps, useLayerList } from '@antv/larkmap';
import { Button, Descriptions, Empty, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './index.less';
import { useModel } from 'umi';
const { Paragraph } = Typography;

export const LayerPopup: React.FC = () => {
  const { resetFeatures, features } = useModel('feature');
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
  console.log(allLayerList,3)
  const layerList = useMemo(() => {
    console.log('3==>4')
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
      console.log(e)

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

  useEffect(() => {
    console.log(layerList,'2')
    layerList.forEach((layer) => layer.on('click', onLayerClick));
    return () => {
      layerList.forEach((layer) => layer.off('click', onLayerClick));
    };
  }, [onLayerClick, layerList]);

  console.log(features);

  return (
    <>
      {popupProps.visible &&
        typeof popupProps.featureIndex === 'number' &&
        targetFeature && (
          <Popup lngLat={popupProps.lngLat} closeButton={false}>
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
              </div>
            </div>
          </Popup>
        )}
    </>
  );
};
