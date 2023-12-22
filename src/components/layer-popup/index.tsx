import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import {
  DrawCircle,
  DrawEvent,
  DrawLine,
  DrawPoint,
  DrawPolygon,
  DrawRect,
} from '@antv/l7-draw';
import type { PopupProps } from '@antv/larkmap';
import { Popup, useLayerList, useScene } from '@antv/larkmap';
import type { Feature, Geometry, GeometryCollection } from '@turf/turf';
import { featureCollection } from '@turf/turf';
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
import { cloneDeep } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureKey, LayerId } from '../../constants';
import { useDrawHelper } from '../../hooks';
import { useFeature, useGlobal } from '../../recoil';
import { getDrawStyle, isCircle, isRect } from '../../utils';
import { prettierText } from '../../utils/prettier-text';
import useStyle from './styles';

const { Paragraph } = Typography;

type DrawType = DrawLine | DrawPoint | DrawPolygon | DrawRect | DrawCircle;

export const LayerPopup: React.FC = () => {
  const [form] = Form.useForm();
  const scene = useScene();
  const {
    saveEditorText,
    isDraw,
    setIsDraw,
    resetFeatures,
    features,
    setFeatures,
    revertCoord,
    transformCoord,
  } = useFeature();
  const { layerColor, popupTrigger } = useGlobal();
  const { t } = useTranslation();
  const helperText = useDrawHelper();
  const styles = useStyle();
  const [addOpen, setAddOpen] = useState(false);
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
  const [addValue, setAddValue] = useState<{
    label: string | undefined;
    value: string | undefined;
  }>({
    label: undefined,
    value: undefined,
  });

  const targetFeature = useMemo(() => {
    return features.find(
      (feature: { properties: Record<string, number | undefined> }) =>
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
        const isIndex =
          popupProps.featureIndex === feature.properties[FeatureKey.Index];
        if (popupProps.visible && isIndex) {
          setPopupProps((oldPopupProps) => {
            return {
              ...oldPopupProps,
              visible: false,
              featureIndex: undefined,
              feature: null,
            };
          });
          return;
        }
        setPopupProps({
          lngLat,
          visible: true,
          featureIndex,
          feature: e.feature,
        });
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
    [setPopupProps, isDraw],
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
  }, [setPopupProps, isDraw]);

  const onEdit = (feature: Feature) => {
    setIsDraw(true);
    let newFeature = cloneDeep(feature);
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
    const onEditFinish = (selectFeature: any, draw: DrawType) => {
      if (!selectFeature) {
        const data = draw.getData();
        if (data.length) {
          newFeature = {
            ...data[0],
            properties: feature?.properties,
          };
          const newTransformFeatures = revertCoord([newFeature])[0];
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          features[index] = newTransformFeatures as Feature<
            Geometry | GeometryCollection,
            Record<string, any>
          >;
        } else {
          features.splice(index, 1);
        }
        draw.destroy();
        setIsDraw(false);
        resetFeatures(features);
      }
    };
    const options: any = {
      initialData: [newFeature],
      maxCount: 1,
      style: getDrawStyle(layerColor),
      helper: helperText,
    };
    let draw: DrawType;
    const [originFeature] = transformCoord([newFeature]);
    const type = originFeature?.geometry.type;
    if (type === 'Point') {
      draw = new DrawPoint(scene, options);
    } else if (type === 'LineString') {
      draw = new DrawLine(scene, options);
    } else if (type === 'Polygon' && isRect(originFeature)) {
      draw = new DrawRect(scene, options);
    } else if (type === 'Polygon' && isCircle(originFeature)) {
      draw = new DrawCircle(scene, options);
    } else {
      draw = new DrawPolygon(scene, options);
    }
    draw.enable();
    draw.setActiveFeature(draw.getData()[0]);
    setFeatures(newFeatures);
    draw.on(DrawEvent.Select, (selectFeature: any) =>
      onEditFinish(selectFeature, draw),
    );
    setPopupProps({
      visible: false,
      featureIndex: undefined,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const layerEvent = {
      click: [{ event: 'click', click: onLayerClick }],
      hover: [
        { event: 'mouseenter', click: onLayerMouseenter },
        { event: 'mouseout', click: onLayerMouseout },
      ],
    };
    //@ts-ignore
    layerEvent[popupTrigger].forEach((e) => {
      layerList.forEach((layer) => layer.on(e.event, e.click));
    });
    return () => {
      //@ts-ignore
      layerEvent[popupTrigger].forEach((e) => {
        layerList.forEach((layer) => layer.off(e.event, e.click));
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLayerClick, onLayerMouseenter, layerList, popupTrigger, scene]);

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
      const revertFeature = revertCoord([feature])[0];
      features[index] = revertFeature as Feature<
        Geometry | GeometryCollection,
        object
      >;
      saveEditorText(prettierText({ content: featureCollection(features) }));
    }
    setTableClick({ isInput: false, index: null });
  };

  const addBlur = () => {
    if (addValue.label && addValue.value) {
      const properties = {
        ...popupProps.feature.properties,
        [addValue.label]: addValue.value,
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
      const revertFeature = revertCoord([feature])[0];
      features[index] = revertFeature as Feature<
        Geometry | GeometryCollection,
        object
      >;
      saveEditorText(prettierText({ content: featureCollection(features) }));
      setAddValue({ label: undefined, value: undefined });
      setAddOpen(!addOpen);
    }
  };

  const popupTable = (
    <div>
      {featureFields.length || addOpen ? (
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
                      copyable={{ text: `${value}` }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {tableClick.isInput && tableClick.index === index ? (
                        <Form form={form} className={styles.form}>
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
                            setAddOpen(false);
                            form.setFieldsValue({ input: value });
                          }}
                        >
                          {value ? String(value) : '-'}
                        </div>
                      )}
                    </Paragraph>
                  </Descriptions.Item>
                );
              }
              return null;
            })}
            {addOpen && (
              <Descriptions.Item
                contentStyle={{ paddingRight: 8 }}
                label={
                  <Input
                    size="small"
                    onChange={(e) => {
                      setAddValue((prevState) => ({
                        ...prevState,
                        label: e.target.value,
                      }));
                    }}
                    onBlur={addBlur}
                  />
                }
              >
                <div className={styles.addField}>
                  <Input
                    size="small"
                    onChange={(e) => {
                      setAddValue((prevState) => ({
                        ...prevState,
                        value: e.target.value,
                      }));
                    }}
                    onBlur={addBlur}
                  />
                  <Button
                    type="text"
                    className={styles.addBut}
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setAddOpen(false);
                    }}
                  />
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      ) : (
        <Empty
          description={t('layer_popup.index.dangQianYuanSuWu')}
          style={{ margin: '12px 0' }}
        />
      )}
      <div style={{ marginTop: 10 }}>
        {!addOpen && popupTrigger === 'click' && (
          <Button
            type="dashed"
            block
            style={{ marginBottom: 6 }}
            onClick={() => {
              setAddOpen(!addOpen);
            }}
          >
            <PlusSquareOutlined />
            {t('layer_popup.index.tianJiaZiDuan')}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {popupProps.visible &&
        typeof popupProps.featureIndex === 'number' &&
        targetFeature && (
          <Popup
            className={styles.layerPopupContent}
            lngLat={popupProps.lngLat}
            closeButton={false}
            offsets={[0, 10]}
            followCursor={popupTrigger === 'hover'}
            closeOnClick
            onClose={() => {
              setAddOpen(false);
            }}
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
                        ? t('layer_popup.index.mULTI')
                        : ''
                    }
                  >
                    <Button
                      size="small"
                      type="link"
                      onClick={() => onEdit(popupProps.feature)}
                      disabled={disabledEdit(popupProps.feature)}
                    >
                      {t('layer_popup.index.gengGaiHuiZhi')}
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
                        features.filter((_: any, index: number) => {
                          return index !== popupProps.featureIndex;
                        }),
                      );
                      setPopupProps({
                        visible: false,
                        featureIndex: undefined,
                      });
                    }}
                  >
                    {t('app_table.index.shanChu')}
                  </Button>
                )}
              </div>
            </div>
          </Popup>
        )}
    </>
  );
};
