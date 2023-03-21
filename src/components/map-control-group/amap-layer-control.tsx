import { FlagOutlined } from '@ant-design/icons';
import { CustomControl, useScene } from '@antv/larkmap';
import { Popover } from 'antd';
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

export function AmapLayerControl() {
  const scene = useScene();
  const [layerType, setLayerType] = useState<string[]>([]);

  const layers = useRef({
    satellite: new AMap.TileLayer.Satellite(),
    roadNet: new AMap.TileLayer.RoadNet(),
    traffic: new AMap.TileLayer.Traffic(),
    buildings: new AMap.Buildings(),
  });

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
    if (scene) {
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
    }
  }, [layerType, scene]);

  const AmapLayer = () => {
    return (
      <div className="amap-info">
        {amaplayerInfo.map((item) => {
          return (
            <div
              key={item.type}
              className="amap-info-item"
              onClick={() => onClick(item)}
              style={{
                border: layerType.includes(item.type)
                  ? '1px solid #1677ff'
                  : 'none',
              }}
            >
              <img src={item.image} alt="" className="amap-info-item-image" />
              <h5>{item.title}</h5>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <CustomControl position="bottomright" className="l7-button-control">
      <Popover
        title={<AmapLayer />}
        trigger="click"
        placement="leftTop"
        overlayInnerStyle={{ width: 325, height: 265 }}
      >
        <FlagOutlined className="l7-amap-control" />
      </Popover>
    </CustomControl>
  );
}
