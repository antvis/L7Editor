import { IconFont, LocalstorageKey } from '@/constants';
import { CustomControl, RasterLayer, useScene } from '@antv/larkmap';
import { useLocalStorageState } from 'ahooks';
import { Checkbox, Popover, Tabs, TabsProps } from 'antd';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import useStyle from './styles';

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
  const styles = useStyle();
  const [layerTypes, setLayerType] = useLocalStorageState<string[]>(
    LocalstorageKey.LayerTypes,
    {
      defaultValue: [],
    },
  );

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

  const isIncludes = (type: string) => layerTypes?.includes(type);

  useEffect(() => {
    if (scene && scene.getType() !== 'mapbox') {
      try {
        const amapAdd = scene.map as any;
        const { roadNet, satellite, traffic, buildings } = layers.current;

        if (isIncludes('Satellite')) {
          amapAdd.add(satellite);
        } else {
          amapAdd.remove(satellite);
        }

        if (isIncludes('RoadNet')) {
          amapAdd.add(roadNet);
        } else {
          amapAdd.remove(roadNet);
        }

        if (isIncludes('Traffic')) {
          amapAdd.add(traffic);
        } else {
          amapAdd.remove(traffic);
        }

        if (isIncludes('Buildings')) {
          amapAdd.add(buildings);
        } else {
          amapAdd.remove(buildings);
        }
      } catch {}
    }
  }, [layerTypes, scene]);

  const onCheckboxChange = (e: any[]) => {
    setLayerType(e);
  };

  const AmapLayer = () => {
    return (
      <div className={styles.amapInfo}>
        <Checkbox.Group value={layerTypes} onChange={onCheckboxChange}>
          {scene.getType() !== 'mapbox' && (
            <>
              {amaplayerInfo.map((item) => {
                return (
                  <Checkbox key={item.type} value={item.type}>
                    <div key={item.type} className={styles.amapInfoItem}>
                      <img
                        src={item.image}
                        alt=""
                        className={styles.amapInfoItemImage}
                      />
                      <h5>{item.title}</h5>
                    </div>
                  </Checkbox>
                );
              })}
            </>
          )}
        </Checkbox.Group>
      </div>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `高德图层`,
      children: <AmapLayer />,
    },
    {
      key: '2',
      label: `谷歌图层`,
      children: (
        <div className="amap-info">
          <Checkbox.Group value={layerTypes} onChange={onCheckboxChange}>
            <Checkbox value={GOOGLE_SATELLITE.type}>
              <div key={GOOGLE_SATELLITE.type} className={styles.amapInfoItem}>
                <img
                  src={GOOGLE_SATELLITE.image}
                  alt=""
                  className={styles.amapInfoItemImage}
                />
                <h5>{GOOGLE_SATELLITE.title}</h5>
              </div>
            </Checkbox>
          </Checkbox.Group>
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomControl
        position="bottomright"
        className={classNames([styles.l7ButtonControl, 'l7-button-control'])}
      >
        <Popover
          content={
            <Tabs items={scene.getType() !== 'mapbox' ? items : [items[1]]} />
          }
          trigger="click"
          placement="leftTop"
          overlayInnerStyle={{
            width: 370,
            height: scene.getType() !== 'mapbox' ? 310 : 190,
          }}
        >
          <IconFont type="icon-ditu" className={styles.l7AmapControl} />
        </Popover>
        {isIncludes(GOOGLE_SATELLITE.type) && (
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
