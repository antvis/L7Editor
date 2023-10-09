import { CustomControl, RasterLayer, useScene } from '@antv/larkmap';
import { Checkbox, Popover, Tabs, Tooltip } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GOOGLE_TILE_MAP_URL,
  IconFont,
  OfficeLayerEnum,
} from '../../../constants';
import { useGlobal } from '../../../recoil';
import useStyle from './styles';

export function OfficialLayerControl() {
  const scene = useScene();
  const styles = useStyle();
  const { layerType, setLayerType, baseMap } = useGlobal();
  const { t } = useTranslation();

  const officeLayerGroup = useMemo(() => {
    return [
      {
        label: t('official_layer_control.index.guGeTuCeng'),
        children: [
          {
            type: OfficeLayerEnum.GoogleSatellite,
            title: t('official_layer_control.index.guGeWeiXingTu'),
            image:
              'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*cet9T5Nh9eIAAAAAAAAAAAAADqWCAQ/original',
            layers: [GOOGLE_TILE_MAP_URL],
          },
        ],
      },
      {
        label: t('official_layer_control.index.gaoDeTuCeng'),
        children: [
          {
            type: OfficeLayerEnum.AmapSatellite,
            title: t('official_layer_control.index.weiXingTu'),
            image:
              'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*cet9T5Nh9eIAAAAAAAAAAAAADqWCAQ/original',
          },
          {
            type: OfficeLayerEnum.AmapRoadNet,
            title: t('official_layer_control.index.luWangTu'),
            image:
              'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*G9RtT7qUxwYAAAAAAAAAAAAADqWCAQ/original',
          },
          {
            type: OfficeLayerEnum.AmapTraffic,
            title: t('official_layer_control.index.luKuangTu'),
            image:
              'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*XTFITYbZaIsAAAAAAAAAAAAADqWCAQ/original',
          },
          {
            type: OfficeLayerEnum.AmapBuildings,
            title: t('official_layer_control.index.louKuaiTu'),
            image:
              'https://mdn.alipayobjects.com/huamei_rzapb5/afts/img/A*hIUgTryh-oAAAAAAAAAAAAAADqWCAQ/original',
          },
        ],
      },
    ];
  }, [baseMap, t]);

  const amapLayerInstanceRef = useRef(
    scene.getType() !== 'mapbox'
      ? {
          satellite: new AMap.TileLayer.Satellite(),
          roadNet: new AMap.TileLayer.RoadNet(),
          traffic: new AMap.TileLayer.Traffic(),
          buildings: new AMap.Buildings(),
        }
      : {},
  );

  const inCludeLayerType = (type: string) => layerType?.includes(type);

  useEffect(() => {
    if (scene && scene.getType() !== 'mapbox') {
      try {
        const amap = scene.map as any;
        const { roadNet, satellite, traffic, buildings } =
          amapLayerInstanceRef.current;

        if (inCludeLayerType('amapSatellite')) {
          amap.add(satellite);
        } else {
          amap.remove(satellite);
        }
        if (inCludeLayerType('RoadNet')) {
          amap.add(roadNet);
        } else {
          amap.remove(roadNet);
        }
        if (inCludeLayerType('Traffic')) {
          amap.add(traffic);
        } else {
          amap.remove(traffic);
        }
        if (inCludeLayerType('Buildings')) {
          amap.add(buildings);
        } else {
          amap.remove(buildings);
        }
      } catch {}
    }
  }, [layerType, scene]);

  const officialLayerList = useMemo(() => {
    const urlList: string[] = [];

    officeLayerGroup
      .map((group) => group.children)
      .flat()
      .forEach((item) => {
        if (layerType.includes(item.type)) {
          // @ts-ignore
          urlList.push(...(item?.layers ?? []));
        }
      });

    return urlList;
  }, [officeLayerGroup, layerType]);

  return (
    <CustomControl position="bottomright" className={styles.l7amap}>
      <Popover
        content={
          <Tabs
            items={officeLayerGroup.map((group) => {
              return {
                label: group.label,
                key: group.label,
                children: (
                  <div className={styles.amapInfo}>
                    <Checkbox.Group
                      value={layerType}
                      onChange={(newLayerType) => {
                        setLayerType(newLayerType as string[]);
                      }}
                    >
                      {group.children.map((item) => {
                        return (
                          <Checkbox key={item.type} value={item.type}>
                            <div
                              key={item.type}
                              className={styles.amapInfoItem}
                            >
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
                    </Checkbox.Group>
                  </div>
                ),
              };
            })}
          />
        }
        trigger="click"
        placement="leftTop"
        overlayInnerStyle={{
          width: 370,
          height: scene.getType() !== 'mapbox' ? 330 : 190,
        }}
      >
        <Tooltip
          title={t('app_header.constants.guanFangTuCeng')}
          placement="left"
        >
          <IconFont
            id="l7-editor-aMap"
            type="icon-tuceng"
            className={styles.l7AmapControl}
          />
        </Tooltip>
      </Popover>

      {officialLayerList.map((url) => {
        return (
          <RasterLayer
            key={url}
            zIndex={1}
            source={{
              data: url,
              parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
            }}
          />
        );
      })}
    </CustomControl>
  );
}
