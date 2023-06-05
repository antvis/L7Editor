import { FeatureKey, LayerId } from '@/constants';
import { getDrawStyle, isCircle, isRect } from '@/utils';
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
import {
  Feature,
  featureCollection,
  Geometry,
  GeometryCollection,
} from '@turf/turf';
import {
  Button,
  Descriptions,
  Empty,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import './index.less';
import useStyle from './styles';
const { Paragraph } = Typography;

type DrawType = DrawLine | DrawPoint | DrawPolygon | DrawRect | DrawCircle;

export const LayerPopup: React.FC = () => {
  const [form] = Form.useForm();
  const scene = useScene();
  const {
    resetFeatures,
    features,
    setFeatures,
    isDraw,
    setIsDraw,
    saveEditorText,
  } = useModel('feature');
  const styles = useStyle();
  const { layerColor } = useModel('global');
  const { popupTrigger } = useModel('global');
  const [popupProps, setPopupProps] = useState<
    PopupProps & { visible: boolean; featureIndex?: number; feature?: any }
  >({
    lngLat: {
      lng: 0,
      lat: 0,
    },
    visible: false,
    feature: null,
  });
  const [tableClick, setTableClick] = useState<{
    isInput: boolean;
    index?: number | null;
  }>({
    isInput: false,
    index: null,
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

  const disabledEdit = (feature: Feature) => {
    if (feature) {
      const reg = RegExp(/Multi/);
      return reg.test(feature.geometry.type);
    }
    return false;
  };

  const onLayerClick = useCallback(
    (e: any) => {
      if (!isDraw) {
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
              feature: null,
            };
          });
        } else {
          setPopupProps({
            lngLat,
            visible: true,
            featureIndex,
            feature: e.feature,
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

  const onEdit = (feature: Feature) => {
    setIsDraw(true);
    const newFeatures = features.filter((item: Feature) => {
      return (
        //@ts-ignore
        item.properties[FeatureKey.Index] !==
        //@ts-ignore
        feature.properties?.[FeatureKey.Index]
      );
    });
    const index = features.findIndex((item: Feature) => {
      return (
        //@ts-ignore
        item.properties[FeatureKey.Index] ===
        //@ts-ignore
        feature.properties?.[FeatureKey.Index]
      );
    });
    const onChange = (selectFeature: any, draw: DrawType) => {
      if (!selectFeature) {
        const getData = draw.getData();
        if (getData.length) {
          const newData = {
            ...getData[0],
            properties: feature?.properties,
          };
          (features[index] = newData as Feature<
            Geometry | GeometryCollection,
            {}
          >),
            saveEditorText(
              prettierText({ content: featureCollection(features) }),
            );
        } else {
          features.splice(index, 1);
          saveEditorText(
            prettierText({ content: featureCollection(features) }),
          );
        }
        draw.destroy();
        setIsDraw(false);
      }
    };
    const options: any = {
      initialData: [feature],
      maxCount: 1,
      style: getDrawStyle(layerColor),
    };
    const type = feature?.geometry.type;
    let drawLayer: DrawType;
    if (type === 'Point') {
      drawLayer = new DrawPoint(scene, {
        ...options,
        style: {
          point: {
            normal: {
              shape: 'drawImg',
              size: 20,
              color: layerColor,
            },
            hover: {
              shape: 'drawImg',
              size: 20,
              color: layerColor,
            },
            active: {
              shape: 'drawImg',
              size: 20,
              color: layerColor,
            },
            style: {
              offsets: [0, 25],
            },
          },
        },
      });
    } else if (type === 'LineString') {
      drawLayer = new DrawLine(scene, options);
    } else if (type === 'Polygon' && isRect(feature)) {
      drawLayer = new DrawRect(scene, options);
    } else if (type === 'Polygon' && isCircle(feature)) {
      drawLayer = new DrawCircle(scene, options);
    } else {
      drawLayer = new DrawPolygon(scene, options);
    }
    drawLayer.enable();
    drawLayer.setActiveFeature(drawLayer.getData()[0]);
    setFeatures(newFeatures);
    drawLayer.on(DrawEvent.Select, (selectFeature: any) =>
      onChange(selectFeature, drawLayer),
    );
    setPopupProps({
      visible: false,
      featureIndex: undefined,
    });
  };

  const onLayerDblClick = (e: any) => {
    const { feature } = e;
    if (!disabledEdit(feature) && !isDraw) {
      onEdit(feature);
    }
  };

  useEffect(() => {
    layerList.forEach((layer) => layer.on('dblclick', onLayerDblClick));
    return () => {
      layerList.forEach((layer) => layer.off('dblclick', onLayerDblClick));
    };
  }, [onLayerDblClick, layerList, popupTrigger, scene]);

  useEffect(() => {
    if (!isDraw) {
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
    }
  }, [onLayerClick, onLayerMouseenter, layerList, popupTrigger, scene, isDraw]);

  const save = (key: string, value: any) => {
    const formValue = form.getFieldValue('input');
    if (value !== formValue) {
      const properties = {
        ...popupProps.feature.properties,
        [key]: formValue,
      };
      const feature = { ...popupProps.feature, properties };
      setPopupProps((event) => ({ ...event, feature }));
      const index = features.findIndex((item: Feature) => {
        return (
          //@ts-ignore
          item.properties[FeatureKey.Index] ===
          //@ts-ignore
          feature.properties?.[FeatureKey.Index]
        );
      });
      features[index] = feature;
      saveEditorText(prettierText({ content: featureCollection(features) }));
    }
    setTableClick({ isInput: false, index: null });
  };

  const popupTable = useMemo(() => {
    return featureFields.length ? (
      <div
        className={styles.layerPopupInfo}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <Descriptions size="small" bordered column={1}>
          {featureFields.map(([key, value], index) => {
            if (!(value instanceof Object)) {
              return (
                <Descriptions.Item label={key} key={key}>
                  <Paragraph
                    copyable
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {tableClick.isInput && tableClick.index === index ? (
                      <Form form={form}>
                        <Form.Item name="input">
                          {typeof value === 'number' ? (
                            <InputNumber
                              autoFocus
                              onPressEnter={() => save(key, value)}
                              onBlur={() => save(key, value)}
                            />
                          ) : (
                            <Input
                              autoFocus
                              onPressEnter={() => save(key, value)}
                              onBlur={() => save(key, value)}
                            />
                          )}
                        </Form.Item>
                      </Form>
                    ) : (
                      <div
                        style={{ width: '100%' }}
                        onClick={() => {
                          setTableClick({
                            isInput: !tableClick.isInput,
                            index: index,
                          });
                          form.setFieldsValue({ input: value });
                        }}
                      >
                        {String(value)}
                      </div>
                    )}
                  </Paragraph>
                </Descriptions.Item>
              );
            }
          })}
        </Descriptions>
      </div>
    ) : (
      <Empty description="当前元素无字段" style={{ margin: '12px 0' }} />
    );
  }, [featureFields, popupProps.feature]);

  return (
    <>
      {popupProps.visible &&
        typeof popupProps.featureIndex === 'number' &&
        targetFeature && (
          <Popup
            lngLat={popupProps.lngLat}
            closeButton={false}
            offsets={[0, 10]}
            followCursor={popupTrigger === 'hover'}
          >
            <div
              className={styles.layerPopup}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {popupTable}
              <div className={styles.layerPopupBtnGroup}>
                {popupTrigger === 'click' && (
                  <Tooltip
                    title={
                      disabledEdit(popupProps.feature)
                        ? 'Multi 类型的 GeoJSON 不支持编辑'
                        : ''
                    }
                  >
                    <Button
                      size="small"
                      type="link"
                      onClick={() => onEdit(popupProps.feature)}
                      disabled={disabledEdit(popupProps.feature)}
                    >
                      编辑
                    </Button>
                  </Tooltip>
                )}
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
