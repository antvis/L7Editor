import type { LineLayerProps } from '@antv/larkmap';
import { CustomControl, LineLayer, Marker, useLayerList } from '@antv/larkmap';
import type { Layer } from '@antv/larkmap/es/types';
import { MODEL_URL, SAMGeo } from '@antv/sam';
import type { Feature, MultiPolygon, Polygon } from '@turf/turf';
import { booleanPointInPolygon, point, polygon } from '@turf/turf';
import { Spin, Tooltip, message } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GOOGLE_TILE_MAP_URL, LayerId } from '../../../constants';
import { useFeature } from '../../../recoil';
import type { IFeatures } from '../../../types';
import { IconFont } from '../../iconfont';
import useStyles from '../styles';
import useStyle from './style';

const options: Omit<LineLayerProps, 'source'> = {
  shape: 'line' as const,
  size: 3,
  color: '#ff0000',
  state: {
    active: false,
  },
  style: {
    opacity: 1,
    lineType: 'solid' as const,
  },
  zIndex: 100,
  animate: {
    interval: 0.6,
    trailLength: 1.5,
    duration: 4,
  },
};

export const SamControl = () => {
  const styles = useStyle();
  const style = useStyles();
  const [samModel, setSamModal] = useState<SAMGeo | null>(null);
  const { scene, features, resetFeatures, revertCoord, bboxAutoFit } =
    useFeature();
  const allLayerList = useLayerList();
  const [samOpen, setSamOpen] = useState(false);
  const [tileLayer, setTileLayer] = useState<Layer | undefined>(undefined);
  const [polygonLayer, setPolygonLayer] = useState<Layer | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState<number[] | undefined>(undefined);
  const [bound, setBound] = useState<
    Feature<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [source, setSource] = useState<any>({
    data: { type: 'FeatureCollection', features: [] },
  });
  const { t } = useTranslation();

  const onMapClick = useCallback(
    (event: any) => {
      const coords = [event.lngLat.lng, event.lngLat.lat] as [number, number];
      if (bound) {
        if (booleanPointInPolygon(point(coords), bound)) {
          if (samModel) {
            const px = samModel.lngLat2ImagePixel(coords)!;
            const newPoint = [
              {
                x: px[0],
                y: px[1],
                clickType: 1,
              },
            ];
            const threshold = 1;

            samModel.predict(newPoint).then(async (res) => {
              const fc = await samModel.exportGeoPolygon(res, threshold);
              const image = samModel.exportImageClip(res)!;
              const newData = {
                feature: fc.features as any,
                imageUrl: image.src,
              };
              if (
                booleanPointInPolygon(point(coords), newData?.feature[0]) &&
                newData?.feature[0].geometry.coordinates[0].length > 4
              ) {
                const newFeature = revertCoord(newData.feature);
                resetFeatures([...features, ...newFeature] as IFeatures);
              } else {
                message.warning(t('map_control_group.sam.tuXingJieXiCuoWu'));
              }
            });
          }
        } else {
          message.error(t('map_control_group.sam.qingZaiQuYuNei'));
        }
      }
    },
    [bound, samModel, revertCoord, resetFeatures, features, t],
  );

  // 生成 embedding 并初始化载入模型
  const generateEmbedding = async () => {
    setLoading(true);
    try {
      if (!tileLayer || !samModel) return;
      // @ts-ignore
      const tileSource = tileLayer.layer.getSource();
      const tiles = tileSource?.tileset?.currentTiles;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      tiles?.forEach((tile: { x: number; y: number; z: number }) => {
        minX = Math.min(minX, tile.x);
        minY = Math.min(minY, tile.y);
        maxX = Math.max(maxX, tile.x);
        maxY = Math.max(maxY, tile.y);
      });
      const zoom = Math.ceil(scene?.getZoom() as number);
      const canvas = document.createElement('canvas');
      canvas.width = (maxX - minX + 1) * 256;
      canvas.height = (maxY - minY + 1) * 256;
      const ctx = canvas.getContext('2d')!;
      const mapHelper = samModel.mapHelper;
      const imageExtent = [
        ...mapHelper.tileToLngLat(minX, maxY + 1, zoom),
        ...mapHelper.tileToLngLat(maxX + 1, minY, zoom),
      ];
      tiles?.forEach((tile: any) => {
        if (tile) {
          ctx?.drawImage(
            tile.data,
            (tile.x - minX) * 256,
            (tile.y - minY) * 256,
            256,
            256,
          );
        }
      });
      // 设置模型的图片
      samModel.setGeoImage(canvas.toDataURL(), {
        extent: imageExtent as any,
        width: canvas.width,
        height: canvas.height,
      });
      const base64 = canvas.toDataURL('image/jpeg');
      const index = (base64 as string).indexOf(',');
      const strBaseImg = (base64 as string)?.substring(index + 1);
      const action = 'https://sam.lvisei.icu/api';
      const formData = new FormData();
      formData.append('image_path', strBaseImg);
      const res = await (
        await fetch(action, {
          body: formData,
          method: 'post',
        })
      ).arrayBuffer();
      try {
        const topRight = mapHelper.tileToLngLat(maxX + 1, minY, zoom);
        const bottomLeft = mapHelper.tileToLngLat(minX, maxY + 1, zoom);
        const topLeft = [bottomLeft[0], topRight[1]];
        const bottomRight = [topRight[0], bottomLeft[1]];
        const bounds = polygon([
          [topRight, topLeft, bottomLeft, bottomRight, topRight],
        ]);
        setMarker(topLeft);
        setBound(bounds);
        setSource({ data: { type: 'FeatureCollection', features: [bounds] } });
        bboxAutoFit([bounds]);
        samModel.setEmbedding(res);
        message.success(t('map_control_group.sam.jiSuanWanCheng'));
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      message.error(t('map_control_group.sam.jiSuanShiBai'));
      scene?.off('click', onMapClick);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sam = new SAMGeo({
      modelUrl: MODEL_URL,
    });
    sam.initModel().then(() => {
      setSamModal(sam);
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(allLayerList)) {
      const targetLayer = allLayerList.find(
        (layer) =>
          layer.type === 'rasterLayer' &&
          [GOOGLE_TILE_MAP_URL].includes(layer.options.source.data),
      );
      const selectLayer = allLayerList.find(
        (layer) => layer.id === LayerId.PolygonLayer,
      );
      setPolygonLayer(selectLayer);
      setTileLayer(targetLayer);
    }
  }, [allLayerList]);

  useEffect(() => {
    if (polygonLayer) {
      if (samOpen) {
        polygonLayer.on('unclick', onMapClick);
      } else {
        setSource({ data: { type: 'FeatureCollection', features: [] } });
        setMarker(undefined);
        polygonLayer.off('unclick', onMapClick);
      }
    }
    return () => {
      polygonLayer?.off('unclick', onMapClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samOpen, scene]);

  useEffect(() => {
    if (samOpen && samModel) {
      generateEmbedding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samOpen, samModel]);

  return (
    <>
      <CustomControl position="bottomright">
        <Tooltip
          title={t('map_control_group.sam.zhiNengXuanZe')}
          placement="left"
        >
          <Spin spinning={loading}>
            <button
              type="button"
              className={style.L7EditorControl}
              onClick={() => {
                setSamOpen(!samOpen);
                if (samOpen) {
                  message.success(
                    t('map_control_group.sam.zhiNengShiBieGuanBi'),
                  );
                }
              }}
            >
              <IconFont
                type="icon-zhinengshibie"
                style={{ fontSize: 20, color: samOpen ? '#1677ff' : '' }}
                className={style.l7EditorIcon}
              />
            </button>
          </Spin>
        </Tooltip>
      </CustomControl>
      {marker && (
        <Marker
          lngLat={{ lng: marker[0], lat: marker[1] }}
          anchor="center"
          //@ts-ignore
          offsets={[54, -16]}
        >
          <div className={styles.marker}>
            {t('map_control_group.sam.ziDongShiBie')}
          </div>
        </Marker>
      )}
      <LineLayer {...options} source={source} />
    </>
  );
};
