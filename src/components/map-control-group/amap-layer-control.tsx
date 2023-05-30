import { IconFont } from '@/constants';
import { CustomControl, RasterLayer, useScene } from '@antv/larkmap';
import { Checkbox, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface AmapLayerProps {
  type: string;
  title: string;
  image: string;
}

/**
 * Satellite 卫星图
 * RoadNet   路网图
 * Traffic   路况图
 * Buildings 楼块图
 */
const amaplayerInfo = [
  {
    type: 'Satellite',
    title: '卫星图',
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*cet9T5Nh9eIAAAAAAAAAAAAADqWCAQ/original',
  },
  {
    type: 'RoadNet',
    title: '路网图',
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*G9RtT7qUxwYAAAAAAAAAAAAADqWCAQ/original',
  },
  {
    type: 'Traffic',
    title: '路况图',
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*XTFITYbZaIsAAAAAAAAAAAAADqWCAQ/original',
  },
  {
    type: 'Buildings',
    title: '楼块图',
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*hIUgTryh-oAAAAAAAAAAAAAADqWCAQ/original',
  },
];

const GOOGLE_SATELLITE = {
  type: 'googleSatellite',
  title: '谷歌卫星图',
  image:
    'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*cet9T5Nh9eIAAAAAAAAAAAAADqWCAQ/original',
};

const url1 =
  'https://www.google.com/maps/vt?lyrs=s@820&gl=cn&x={x}&y={y}&z={z}';
const url2 =
  'https://tiles{1-3}.geovisearth.com/base/v1/cat/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';

export function AmapLayerControl() {
  const scene = useScene();
  const [layerType, setLayerType] = useState<string[]>([]);

  const layers = useRef(
    scene.getType() !== 'mapbox'
      ? {
          satellite: new AMap.TileLayer.Satellite(),
          roadNet: new AMap.TileLayer.RoadNet(),
          traffic: new AMap.TileLayer.Traffic(),
          buildings: new AMap.Buildings(),
        }
      : {},
  );

  const onClick = (item: AmapLayerProps) => {
    setLayerType((pre: any) => {
      if (pre.includes(item.type)) {
        return pre.filter((p: string) => p !== item.type);
      }
      return [...pre, item.type];
    });
  };

  const isIncludes = (type: string) => layerType.includes(type);

  useEffect(() => {
    if (scene && scene.getType() !== 'mapbox') {
      try {
        const amapAdd = scene.map as any;
        const { roadNet, satellite, traffic, buildings } = layers.current;

        isIncludes('Satellite')
          ? amapAdd.add(satellite)
          : amapAdd.remove(satellite);

        isIncludes('RoadNet') ? amapAdd.add(roadNet) : amapAdd.remove(roadNet);

        isIncludes('Traffic') ? amapAdd.add(traffic) : amapAdd.remove(traffic);

        isIncludes('Buildings')
          ? amapAdd.add(buildings)
          : amapAdd.remove(buildings);
      } catch {}
    }
  }, [layerType, scene]);

  const AmapLayer = () => {
    return (
      <div className="amap-info">
        <Checkbox.Group value={layerType}>
          {scene.getType() !== 'mapbox' && (
            <>
              {amaplayerInfo.map((item) => {
                return (
                  <Checkbox
                    key={item.type}
                    value={item.type}
                    onClick={() => {
                      onClick(item);
                    }}
                  >
                    <div key={item.type} className="amap-info-item">
                      <img
                        src={item.image}
                        alt=""
                        className="amap-info-item-image"
                      />
                      <h5>{item.title}</h5>
                    </div>
                  </Checkbox>
                );
              })}
            </>
          )}
          <Checkbox
            value={GOOGLE_SATELLITE.type}
            onClick={() => {
              onClick(GOOGLE_SATELLITE);
            }}
          >
            <div key={GOOGLE_SATELLITE.type} className="amap-info-item">
              <img src={GOOGLE_SATELLITE.image} alt="" className="amap-info-item-image" />
              <h5>{GOOGLE_SATELLITE.title}</h5>
            </div>
          </Checkbox>
        </Checkbox.Group>
      </div>
    );
  };

  return (
    <>
      <CustomControl position="bottomright" className="l7-button-control">
        <Popover
          content={<AmapLayer />}
          trigger="click"
          placement="leftTop"
          overlayInnerStyle={{
            width: 345,
            height: scene.getType() !== 'mapbox' ? 360 : 130,
          }}
        >
          <IconFont type="icon-ditu" className="l7-amap-control" />
        </Popover>
        {!!layerType.includes(GOOGLE_SATELLITE.type) && (
          <>
            <RasterLayer
              zIndex={1}
              source={{
                data: url1,
                parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
              }}
            />
            <RasterLayer
              zIndex={1}
              source={{
                data: url2,
                parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
              }}
            />
          </>
        )}
      </CustomControl>
    </>
  );
}
