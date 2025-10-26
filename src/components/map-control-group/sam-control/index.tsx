import type { LineLayerProps } from '@antv/larkmap';
import { CustomControl, LineLayer, Marker, useLayerList } from '@antv/larkmap';
import type { Layer } from '@antv/larkmap/es/types';
import { SAMGeo } from '@antv/sam';
import type { MultiPolygon, Polygon, Feature } from '@turf/turf';
import { booleanPointInPolygon, point, polygon } from '@turf/turf';
import { Spin, Tooltip, message } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayerId } from '../../../constants';
import { useFeature, useGlobal } from '../../../recoil';
import type { SAMAdapter } from '../../../types/sam';
import type { IFeatures } from '../../../types';
import { IconFont } from '../../iconfont';
import useStyles from '../styles';
import useStyle from './style';

interface IGeoJsonOutput {
  type: 'FeatureCollection';
  features: Feature[];
}

interface SAMPoint {
  x: number;
  y: number;
  clickType: number;
}

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
  const [samModel, setSamModal] = useState<SAMAdapter | null>(null);
  const { scene, features, resetFeatures, revertCoord, bboxAutoFit } = useFeature();
  const { wasmPath, samModelUrl } = useGlobal();
  const allLayerList = useLayerList();
  const [samOpen, setSamOpen] = useState(false);
  const [tileLayer, setTileLayer] = useState<Layer | undefined>(undefined);
  const [polygonLayer, setPolygonLayer] = useState<Layer | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState<number[] | undefined>(undefined);
  const [bound, setBound] = useState<Feature<Polygon | MultiPolygon> | undefined>(undefined);
  const [source, setSource] = useState<any>({ data: { type: 'FeatureCollection', features: [] } });
  const { t } = useTranslation();

  const onMapClick = useCallback(
    async (event: { lngLat: { lng: number; lat: number } }) => {
      const coords = [event.lngLat.lng, event.lngLat.lat] as [number, number];
      if (!bound) return;
      if (!booleanPointInPolygon(point(coords), bound)) {
        message.error(t('map_control_group.sam.qingZaiQuYuNei'));
        return;
      }
      if (!samModel) return;

      const px = samModel.lngLat2ImagePixel(coords)!;
      const newPoint: SAMPoint[] = [
        {
          x: px[0],
          y: px[1],
          clickType: 1,
        },
      ];
      const threshold = 1;

      try {
  // Use SAMAdapter interface for typed calls
  const output: any = await (samModel as SAMAdapter).predict(newPoint);
  const fc: IGeoJsonOutput = await (samModel as SAMAdapter).exportGeoPolygon(output, threshold);
  const image: HTMLImageElement = await (samModel as SAMAdapter).exportImageClip(output);

        const newData = {
          feature: fc.features as Feature[],
          imageUrl: image?.src,
        };

  const isInside = booleanPointInPolygon(point(coords), newData.feature[0] as Feature<Polygon | MultiPolygon>);
  const geometry = (newData.feature[0] as Feature<Polygon | MultiPolygon> | undefined)?.geometry as Polygon | MultiPolygon | undefined;
        const hasEnoughCoords = !!(geometry?.coordinates && (geometry.coordinates as any)[0]?.length > 4);

        if (isInside && hasEnoughCoords) {
          const newFeature = revertCoord(newData.feature);
          resetFeatures([...features, ...newFeature] as IFeatures);
          message.success('识别成功');
        } else {
          message.warning(t('map_control_group.sam.tuXingJieXiCuoWu'));
        }
      } catch (error) {
        console.error(error);
        message.error(t('map_control_group.sam.qingZaiQuYuNei'));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bound, samModel, features, t],
  );

  // 生成 embedding 并初始化载入模型
  const generateEmbedding = async () => {
    setLoading(true);
    try {
      if (!tileLayer || !samModel) return;
      // @ts-ignore - Using internal layer API
      const tileSource = (tileLayer as any).layer.getSource();
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
      const mapHelper = (samModel as any).mapHelper;
      const imageExtent = [
        ...mapHelper.tileToLngLat(minX, maxY + 1, zoom),
        ...mapHelper.tileToLngLat(maxX + 1, minY, zoom),
      ];
      tiles?.forEach((tile: { data: HTMLImageElement; x: number; y: number }) => {
        if (tile) {
          ctx?.drawImage(tile.data, (tile.x - minX) * 256, (tile.y - minY) * 256, 256, 256);
        }
      });
      // 设置模型的图片
      await (samModel as any).setGeoImage(canvas.toDataURL(), {
        extent: imageExtent as [number, number, number, number],
        width: canvas.width,
        height: canvas.height,
      });
      const base64 = canvas.toDataURL('image/jpeg');
      const index = base64.indexOf(',');
      const strBaseImg = base64.substring(index + 1);
      const action = 'https://sam.lvisei.icu/api';
      const formData = new FormData();
      formData.append('image_path', strBaseImg);
      const res = await (await fetch(action, { body: formData, method: 'post' })).arrayBuffer();
      try {
        const topRight = mapHelper.tileToLngLat(maxX + 1, minY, zoom);
        const bottomLeft = mapHelper.tileToLngLat(minX, maxY + 1, zoom);
        const topLeft = [bottomLeft[0], topRight[1]] as [number, number];
        const bottomRight = [topRight[0], bottomLeft[1]] as [number, number];
        const bounds = polygon([[topRight, topLeft, bottomLeft, bottomRight, topRight]]);
        setMarker(topLeft);
        setBound(bounds);
        setSource({ data: { type: 'FeatureCollection', features: [bounds] } });
        bboxAutoFit([bounds]);
        (samModel as any).setEmbedding(res);
        message.success(t('map_control_group.sam.jiSuanWanCheng'));
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      message.error(t('map_control_group.sam.jiSuanShiBai'));
      scene?.off('click', onMapClick);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadModel = async () => {
      const modelUrl = samModelUrl || 'https://gw.alipayobjects.com/os/bmw-prod/4784c378-3824-4c34-9ca9-33d2d72d6d92.onnx';
      const wasm = wasmPath || 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort-wasm.wasm';
      try {
        // SAMGeo.init may exist depending on package version
        const samInstance = (SAMGeo as any).init ? (SAMGeo as any).init({ modelUrl, wasmPaths: wasm }) : new (SAMGeo as any)({ modelUrl, wasmPaths: wasm });
        if (samInstance.initModel) {
          await samInstance.initModel();
        }
        // cast to our SAMAdapter type
        setSamModal(samInstance as SAMAdapter);
      } catch (error) {
        console.error(error);
        message.error(t('map_control_group.sam.diKuaiShiBieShiBei'));
      }
    };

    loadModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(allLayerList)) {
      const targetLayer = allLayerList.find((layer) => layer.id === 'googleTileMap');
      const selectLayer = allLayerList.find((layer) => layer.id === LayerId.PolygonLayer);
      setPolygonLayer(selectLayer);
      setTileLayer(targetLayer);
    }
  }, [allLayerList]);
    // Removed unused hoverLayer variable

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
  }, [samOpen, scene, onMapClick]);

  useEffect(() => {
    if (samOpen && samModel) {
      generateEmbedding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samOpen, samModel]);

  return (
    <>
      <CustomControl position="bottomright">
        <Tooltip title={t('map_control_group.sam.zhiNengXuanZe')} placement="left">
          <Spin spinning={loading}>
            <button
              type="button"
              className={style.L7EditorControl}
              onClick={() => {
                if (samModel) {
                  setSamOpen(!samOpen);
                }
                if (samOpen) {
                  message.success(t('map_control_group.sam.zhiNengShiBieGuanBi'));
                }
              }}
            >
              <IconFont type="icon-zhinengshibie" style={{ fontSize: 20, color: samOpen ? '#1677ff' : '' }} className={style.l7EditorIcon} />
            </button>
          </Spin>
        </Tooltip>
      </CustomControl>
      {marker && (
        <Marker lngLat={{ lng: marker[0], lat: marker[1] }} anchor="center" //@ts-ignore
          offsets={[54, -16]}
        >
          <div className={styles.marker}>{t('map_control_group.sam.ziDongShiBie')}</div>
        </Marker>
      )}
      <LineLayer {...options} source={source} />
    </>
  );
};

export default SamControl;
