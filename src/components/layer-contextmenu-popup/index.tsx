import { Marker, PopupProps, useLayerList, useScene } from '@antv/larkmap';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FeatureKey, LayerId } from '../../constants';
import { useFeature } from '../../recoil';
import { GeoJSON2Wkt } from '../../utils/wkt';
import CodeBlock from './code-block';
import useStyle from './styles';

const copyTypeList = ['GeoJSON', 'WKT'];

export const LayerContextmenuPopup: React.FC = () => {
  const scene = useScene();
  const { isDraw, features } = useFeature();

  const styles = useStyle();
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

  const targetFeature = useMemo(() => {
    return features.find(
      (feature: { properties: { [x: string]: number | undefined } }) =>
        // @ts-ignore
        feature.properties?.[FeatureKey.Index] === popupProps.featureIndex,
    );
  }, [features, popupProps]);
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

  useEffect(() => {
    //@ts-ignore
    layerList.forEach((layer) => layer.on('contextmenu', onLayerClick));
    return () => {
      //@ts-ignore
      layerList.forEach((layer) => layer.off('contextmenu', onLayerClick));
    };
  }, [onLayerClick, layerList, scene]);

  return (
    <>
      {popupProps.visible &&
        typeof popupProps.featureIndex === 'number' &&
        targetFeature &&
        popupProps.lngLat && (
          <Marker lngLat={popupProps.lngLat} anchor="top-left">
            <div className={styles.layerPopupContent}>
              {copyTypeList.map((item) => {
                return (
                  <div className={styles.layerPopupCopyRow} key={item}>
                    <div className={styles.layerPopupCopyText}>{item}</div>
                    <CodeBlock
                      copyType={item}
                      text={
                        item === 'geoJson'
                          ? JSON.stringify(popupProps.feature)
                          : GeoJSON2Wkt({
                              type: 'FeatureCollection',
                              features: [popupProps.feature],
                            })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </Marker>
        )}
    </>
  );
};
