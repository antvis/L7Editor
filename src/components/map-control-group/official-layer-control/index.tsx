import I18N from '@/locales';
import { CustomControl, RasterLayer, useScene } from '@antv/larkmap';
import { Checkbox, Popover, Tabs, TabsProps, Tooltip } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useEffect, useRef } from 'react';
import { IconFont } from '../../../constants';
import { useGlobal } from '../../../recoil';
import useStyle from './styles';

/**
 * Satellite 卫星图
 * RoadNet   路网图
 * Traffic   路况图
 * Buildings 楼块图
 */
const AmapLayerList = [
  {
    type: 'Satellite',
    title: I18N.t('official_layer_control.index.weiXingTu'),
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*cet9T5Nh9eIAAAAAAAAAAAAADqWCAQ/original',
  },
  {
    type: 'RoadNet',
    title: I18N.t('official_layer_control.index.luWangTu'),
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*G9RtT7qUxwYAAAAAAAAAAAAADqWCAQ/original',
  },
  {
    type: 'Traffic',
    title: I18N.t('official_layer_control.index.luKuangTu'),
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*XTFITYbZaIsAAAAAAAAAAAAADqWCAQ/original',
  },
  {
    type: 'Buildings',
    title: I18N.t('official_layer_control.index.louKuaiTu'),
    image:
      'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*hIUgTryh-oAAAAAAAAAAAAAADqWCAQ/original',
  },
];

const GOOGLE_SATELLITE = {
  type: 'googleSatellite',
  title: I18N.t('official_layer_control.index.guGeWeiXingTu'),
  image:
    'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*cet9T5Nh9eIAAAAAAAAAAAAADqWCAQ/original',
};

const TILE_MAP_URL =
  'https://www.google.com/maps/vt?lyrs=s@820&gl=cn&x={x}&y={y}&z={z}';
const TILE_MARK_URL =
  'https://tiles{1-3}.geovisearth.com/base/v1/cat/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';

export function OfficialLayerControl() {
  const scene = useScene();
  const styles = useStyle();
  const { layerType, setLayerType } = useGlobal();

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

  const isIncludes = (type: string) => layerType?.includes(type);

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
  }, [layerType, scene]);

  const onCheckboxChange = (e: (CheckboxValueType | string)[]) => {
    setLayerType(e as string[]);
  };

  const AmapLayer = () => {
    return (
      <div className={styles.amapInfo}>
        <Checkbox.Group value={layerType} onChange={onCheckboxChange}>
          {scene.getType() !== 'mapbox' && (
            <>
              {AmapLayerList.map((item) => {
                return (
                  <Checkbox key={item.type} value={item.type}>
                    <div key={item.type} className={styles.amapInfoItem}>
                      <img
                        src={item.image}
                        alt=""
                        className={styles.amapInfoItemImage}
                      />
                      <h5 style={{ marginTop: 0 }}>{item.title}</h5>
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
      label: I18N.t('official_layer_control.index.gaoDeTuCeng'),
      children: <AmapLayer />,
    },
    {
      key: '2',
      label: I18N.t('official_layer_control.index.guGeTuCeng'),
      children: (
        <div className={styles.amapInfo}>
          <Checkbox.Group value={layerType} onChange={onCheckboxChange}>
            <Checkbox value={GOOGLE_SATELLITE.type}>
              <div key={GOOGLE_SATELLITE.type} className={styles.amapInfoItem}>
                <img
                  src={GOOGLE_SATELLITE.image}
                  alt=""
                  className={styles.amapInfoItemImage}
                />
                <h5 style={{ marginTop: 0 }}>{GOOGLE_SATELLITE.title}</h5>
              </div>
            </Checkbox>
          </Checkbox.Group>
        </div>
      ),
    },
  ];

  return (
    <CustomControl position="bottomright" className={styles.l7amap}>
      <Popover
        content={
          <Tabs items={scene.getType() !== 'mapbox' ? items : [items[1]]} />
        }
        trigger="click"
        placement="leftTop"
        overlayInnerStyle={{
          width: 370,
          height: scene.getType() !== 'mapbox' ? 330 : 190,
        }}
      >
        <Tooltip title={I18N.t('app_header.constants.guanFangTuCeng')} placement="left">
          <IconFont
            id="l7-editor-aMap"
            type="icon-ditu"
            className={styles.l7AmapControl}
          />
        </Tooltip>
      </Popover>
      {isIncludes(GOOGLE_SATELLITE.type) && (
        <>
          <RasterLayer
            zIndex={1}
            source={{
              data: TILE_MAP_URL,
              parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
            }}
          />
          <RasterLayer
            zIndex={1}
            source={{
              data: TILE_MARK_URL,
              parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
            }}
          />
        </>
      )}
    </CustomControl>
  );
}
