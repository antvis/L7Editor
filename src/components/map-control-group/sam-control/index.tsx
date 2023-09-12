import { Bounds } from '@antv/l7';
import {
  CustomControl,
  LineLayer,
  LineLayerProps,
  Marker,
  useLayerList,
} from '@antv/larkmap';
import { Layer } from '@antv/larkmap/es/types';
import { MODEL_URL, SAMGeo } from '@antv/sam';
import {
  Feature,
  MultiPolygon,
  Polygon,
  booleanPointInPolygon,
  point,
  polygon,
} from '@turf/turf';
import { Spin, Tooltip, message } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';
import { IconFont } from '../../../constants';
import { useFeature } from '../../../recoil';
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
  const [samModel, setSamModal] = useState<SAMGeo | null>(null);
  const { scene, features, resetFeatures } = useFeature();
  const allLayerList = useLayerList();
  const [samOpen, setSamOpen] = useState(false);
  const [tileLayer, setTileLayer] = useState<Layer | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState<number[] | undefined>(undefined);
  const [bound, setBound] = useState<
    Feature<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [source, setSource] = useState<any>({
    data: { type: 'FeatureCollection', features: [] },
  });

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
      samModel.setEmbedding(res);
      message.success('embedding计算完成');
    } catch (error) {
      message.error('embedding计算失败');
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
      const moreTileLayer = allLayerList.find(
        (item) => item.id === 'reactLayerGoode',
      );
      setTileLayer(moreTileLayer);
    }
  }, [allLayerList]);

  const onMapClick = useCallback(
    (event: any) => {
      const coords = [event.lnglat.lng, event.lnglat.lat] as [number, number];
      if (bound) {
        if (booleanPointInPolygon(point(coords), bound)) {
          if (samModel) {
            const px = samModel.lngLat2ImagePixel(coords)!;
            const point = [
              {
                x: px[0],
                y: px[1],
                clickType: 1,
              },
            ];
            const threshold = 1;

            samModel.predict(point).then(async (res) => {
              const polygon = await samModel.exportGeoPolygon(res, threshold);
              const image = samModel.exportImageClip(res)!;
              const newData = {
                feature: polygon.features as any,
                imageUrl: image.src,
              };
              resetFeatures([...features, ...newData.feature]);
            });
          }
        } else {
          message.error('请在区域内进行选择');
        }
      }
    },
    [samModel, features, bound],
  );

  useEffect(() => {
    if (scene) {
      if (samOpen) {
        scene.on('click', onMapClick);
      } else {
        setSource({ data: { type: 'FeatureCollection', features: [] } });
        setMarker(undefined);
        scene.off('click', onMapClick);
      }
      return () => {
        scene.off('click', onMapClick);
      };
    }
  }, [samOpen, scene, onMapClick]);

  useEffect(() => {
    if (samOpen && samModel) {
      generateEmbedding();
    }
  }, [samOpen, samModel]);

  return (
    <>
      <CustomControl position="bottomright">
        <Tooltip title={'智能选择'} placement="bottom">
          <Spin spinning={loading}>
            <div
              className={classNames([styles.sam, 'l7-button-control'])}
              onClick={() => {
                setSamOpen(!samOpen);
              }}
              style={{ color: samOpen ? '#006fde' : '' }}
            >
              <IconFont type="icon-zhinengxuanze" className={styles.samSvg} />
            </div>
          </Spin>
        </Tooltip>
      </CustomControl>
      {marker && (
        <Marker
          lngLat={{ lng: marker[0], lat: marker[1] }}
          anchor="center"
          //@ts-ignore
          offsets={[43, -16]}
        >
          <div className={styles.marker}>自动识别边界</div>
        </Marker>
      )}
      <LineLayer {...options} source={source} />
    </>
  );
};
