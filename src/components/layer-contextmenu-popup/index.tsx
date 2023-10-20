import type { PopupProps } from '@antv/larkmap';
import { Marker, useLayerList, useScene } from '@antv/larkmap';
import { featureCollection } from '@turf/turf';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FeatureKey, LayerId } from '../../constants';
import { useFeature } from '../../recoil';
import { GeoJSON2Wkt } from '../../utils/wkt';
import CodeBlock from './code-block';
import useStyle from './styles';

export const LayerContextmenuPopup: React.FC = () => {
  const scene = useScene();
  const { isDraw, features } = useFeature();

  const styles = useStyle();
  const [markerProps, setMarkerProps] = useState<
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
      (feature: { properties: Record<string, number | undefined> }) =>
        // @ts-ignore
        feature.properties?.[FeatureKey.Index] === markerProps.featureIndex,
    );
  }, [features, markerProps]);
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
          markerProps.featureIndex === feature.properties[FeatureKey.Index];
        if (markerProps.visible && isIndex) {
          setMarkerProps((oldPopupProps) => {
            return {
              ...oldPopupProps,
              visible: false,
              featureIndex: undefined,
              feature: null,
            };
          });
          return;
        }
        setMarkerProps({
          lngLat,
          visible: true,
          featureIndex,
          feature: e.feature,
        });
      }
    },
    [setMarkerProps, markerProps, isDraw],
  );

  // 单击事件关闭菜单
  const mapRightMenuClose = () => {
    const timeOut = setTimeout(() => {
      if (timeOut) {
        clearTimeout(timeOut);
        setMarkerProps({
          lngLat: {
            lng: 0,
            lat: 0,
          },
          visible: false,
          feature: null,
        });
      }
    }, 0);
  };

  useEffect(() => {
    //@ts-ignore
    layerList.forEach((layer) => layer.on('contextmenu', onLayerClick));
    scene.on('click', mapRightMenuClose);
    return () => {
      //@ts-ignore
      layerList.forEach((layer) => layer.off('contextmenu', onLayerClick));
      scene.off('click', mapRightMenuClose);
    };
  }, [onLayerClick, layerList, scene]);

  const copyTypeList = useMemo(() => {
    if (!markerProps.feature) {
      return [];
    }
    const index = markerProps.feature.properties[FeatureKey.Index];
    const featureCollectionData = featureCollection([features[index]]);
    return [
      {
        copyType: 'GeoJSON',
        text: JSON.stringify(featureCollectionData),
      },
      {
        copyType: 'WKT',
        text: GeoJSON2Wkt(featureCollectionData),
      },
    ];
  }, [features, markerProps.feature]);

  return (
    <>
      {markerProps.visible &&
        typeof markerProps.featureIndex === 'number' &&
        targetFeature &&
        markerProps.lngLat && (
          <Marker
            lngLat={markerProps.lngLat}
            anchor="top-left"
            // @ts-ignore
            offsets={[0, 10]}
          >
            <div className={styles.layerPopupContent}>
              {copyTypeList.map((item) => {
                return (
                  <div className={styles.layerPopupCopyRow} key={item.copyType}>
                    <CodeBlock copyType={item.copyType} text={item.text} />
                  </div>
                );
              })}
            </div>
          </Marker>
        )}
    </>
  );
};
