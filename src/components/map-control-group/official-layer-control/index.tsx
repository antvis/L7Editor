import { CustomControl, RasterLayer } from '@antv/larkmap';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GOOGLE_TILE_MAP_ROUTER_URL,
  GOOGLE_TILE_MAP_URL,
  OfficeLayerEnum,
} from '../../../constants';
import { useGlobal } from '../../../recoil';
import useStyle from './styles';

export function OfficialLayerControl() {
  const styles = useStyle();
  const { layerType, setLayerType } = useGlobal();
  const { t } = useTranslation();
  const [radioValue, setRadioValue] = useState(
    layerType.length
      ? OfficeLayerEnum.GoogleSatellite
      : OfficeLayerEnum.VectorMap,
  );

  const officeLayerGroup = useMemo(() => {
    return [
      {
        type: OfficeLayerEnum.VectorMap,
        title: t('official_layer_control.index.shiLiangDiTu'),
        image:
          'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*qdFDSbvIalgAAAAAAAAAAAAADmJ7AQ/original',
        layers: [],
      },
      {
        type: OfficeLayerEnum.GoogleSatellite,
        title: t('official_layer_control.index.guGeWeiXingTu'),
        image:
          'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*zi2jSqqZ2-8AAAAAAAAAAAAADjWqAQ/original',
        layers: [GOOGLE_TILE_MAP_URL],
      },
    ];
  }, [t]);

  return (
    <>
      <CustomControl position="bottomleft">
        <div className={styles.mapTab}>
          <div className={styles.amapInfo}>
            {officeLayerGroup.map((item) => {
              return (
                <div
                  key={item.type}
                  className={classNames([
                    styles.amapInfoItem,
                    item.type === radioValue
                      ? styles.itemBorderActive
                      : styles.itemBorder,
                  ])}
                  onClick={() => {
                    setRadioValue(item.type);
                    setLayerType(
                      item.type === OfficeLayerEnum.GoogleSatellite
                        ? [OfficeLayerEnum.GoogleSatellite]
                        : ([] as string[]),
                    );
                  }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className={styles.amapInfoItemImage}
                  />
                  <div style={{ marginTop: 0 }}>{item.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CustomControl>
      <div>
        {layerType.length && (
          <>
            <RasterLayer
              key={GOOGLE_TILE_MAP_URL}
              zIndex={1}
              id="googleTileMap"
              source={{
                data: GOOGLE_TILE_MAP_URL,
                parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
              }}
            />
            <RasterLayer
              key={GOOGLE_TILE_MAP_ROUTER_URL}
              zIndex={1}
              source={{
                data: GOOGLE_TILE_MAP_ROUTER_URL,
                parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
