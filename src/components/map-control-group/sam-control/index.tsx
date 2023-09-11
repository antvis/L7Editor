import { CustomControl, PolygonLayer, PolygonLayerProps, useLayerList } from '@antv/larkmap';
import { MODEL_URL, SAMGeo } from '@antv/sam';
import { Spin, Tooltip, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IconFont } from '../../../constants';
import { useFeature, useGlobal } from '../../../recoil';
import useStyle from './style';
import { isEmpty } from 'lodash-es';
import { Layer } from '@antv/larkmap/es/types';

export type ClipData = {
  imageUrl: string;
  feature: any[];
};

export const SamControl = () => {
  const styles = useStyle();
  const [samModel, setSamModal] = useState<SAMGeo | null>(null);
  const { scene } = useFeature();
  const allLayerList = useLayerList();
  const [samOpen, setSamOpen] = useState(false);
  const [tileLayer, setTileLayer] = useState<Layer | undefined>(undefined);
  const [loading, setLoading] = useState(false)
  const { layerColor } = useGlobal();
  const [clipData, setClipData] = useState<ClipData[]>([]);

  const options: Omit<PolygonLayerProps, 'source'> = useMemo(() => {
    return {
      shape: 'fill',
      color: layerColor,
      state: {
        active: true,
      },
      style: {
        opacity: 0.6,
      },
    }
  }, [layerColor])

  // 生成 embedding 并初始化载入模型
  const generateEmbedding = async () => {
    setLoading(true)
    try {
      if (!tileLayer || !samModel) return
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
          ctx?.drawImage(tile.data, (tile.x - minX) * 256, (tile.y - minY) * 256, 256, 256);
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
      samModel.setEmbedding(res);
      message.success('embedding计算完成');
    } catch (error) {
      message.success('embedding计算失败');
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    if (MODEL_URL) {
      const sam = new SAMGeo({
        modelUrl: MODEL_URL,
      });

      sam.initModel().then(() => {
        setSamModal(sam);
      });
    }
    if (!isEmpty(allLayerList)) {
      const moreTileLayer = allLayerList
        .find((item) => item.id === 'reactLayerGoode')
      setTileLayer(moreTileLayer);
    }
  }, [MODEL_URL, allLayerList]);

  const onMapClick = useCallback((event: any) => {
    const coords = [event.lnglat.lng, event.lnglat.lat] as [number, number];
    if (samModel) {
      console.log(samModel)
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
        setClipData((pre) => {
          const hasData = pre.find((item) => item.imageUrl === newData.imageUrl);
          if (hasData) {
            return [...pre];
          }
          return [...pre, newData];
        });
      });
    }
  }, [samModel]);


  useEffect(() => {
    if (scene) {
      if (samOpen) {
        scene.on('click', onMapClick);
      } else {
        scene.off('click', onMapClick);
        setClipData([])
      }
    }
  }, [samOpen, scene, onMapClick]);

  useEffect(() => {
    if (samOpen && samModel) {
      generateEmbedding()
    }
  }, [samOpen, samModel])

  const source: any = useMemo(() => {
    const newFeature = clipData.map((item) => item.feature);
    return {
      type: 'FeatureCollection',
      features: newFeature.flat(),
    };
  }, [clipData])

  return (
    <CustomControl position="bottomright">
      <Tooltip title={'智能选择'} placement="bottom">
        <Spin spinning={loading}>
          <div
            className={styles.sam}
            onClick={() => {
              setSamOpen(!samOpen);
            }}
            style={{ color: samOpen ? '#006fde' : '' }}
          >
            <IconFont type="icon-zhinengxuanze" className={styles.samSvg} />
          </div>
        </Spin >
      </Tooltip>
      <PolygonLayer {...options} source={{
        data: source,
        parser: { type: 'geojson' },
      }} />
    </CustomControl>
  );
};
