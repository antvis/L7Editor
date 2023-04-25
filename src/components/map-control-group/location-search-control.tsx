import { getPointImage } from '@/utils/change-image-color';
import { SearchOutlined } from '@ant-design/icons';
import {
  CustomControl,
  LocationSearch,
  LocationSearchOption,
  Marker,
  useScene,
} from '@antv/larkmap';
import { point } from '@turf/turf';
import { useModel } from '@umijs/max';
import { useAsyncEffect } from 'ahooks';
import { Button, Popover } from 'antd';
import Color from 'color';
import React, { useCallback, useEffect, useState } from 'react';

const LocationSearchControl: React.FC = React.memo(() => {
  const scene = useScene();
  const [selectLocation, setSelectLocation] = useState<LocationSearchOption>();
  const [locationText, setLocationText] = useState('');
  const { features, resetFeatures } = useModel('feature');
  const { layerColor } = useModel('global');
  const [isVisible, setIsVisible] = useState(false);
  const [colorImg, setColorImg] = useState<HTMLImageElement | undefined>();

  const syncMapCenter = useCallback(() => {
    if (scene) {
      const { lng, lat } = scene.getCenter();
      setLocationText(`${lng},${lat}`);
    }
  }, [scene]);

  useEffect(() => {
    syncMapCenter();
    scene?.on('moveend', syncMapCenter);
    scene?.on('zoomend', syncMapCenter);

    return () => {
      scene?.off('moveend', syncMapCenter);
      scene?.off('zoomend', syncMapCenter);
    };
  }, [scene, syncMapCenter]);

  useAsyncEffect(async () => {
    const newLayerColor = Color(layerColor).rgb().object();
    setColorImg(await getPointImage(newLayerColor, { x: 100, y: 100 }));
  }, [layerColor]);

  return (
    <>
      <CustomControl position="topleft" style={{ display: 'flex' }}>
        <div className="l7-draw-switch" style={{ marginRight: '8px' }}>
          <button
            className="l7-draw-control__btn"
            style={{ borderRight: 'none' }}
          >
            <SearchOutlined
              className="l7-draw-icon"
              style={{ fontSize: 16, lineHeight: '30px' }}
              onClick={() => {
                setIsVisible(!isVisible);
              }}
            />
          </button>
        </div>
        <div className="l7-location-search">
          {isVisible && (
            <LocationSearch
              getPopupContainer={() =>
                document.querySelector('.larkmap') as HTMLElement
              }
              style={{ width: 200 }}
              value={selectLocation?.name}
              searchParams={{
                key: '98d10f05a2da96697313a2ce35ebf1a2',
                location: locationText,
              }}
              onChange={(_, item) => {
                if (item) {
                  const currentZoom = scene.getZoom();
                  scene.setZoomAndCenter(currentZoom > 16 ? currentZoom : 16, [
                    item.longitude,
                    item.latitude,
                  ]);
                }
                setSelectLocation(item);
              }}
            />
          )}
        </div>
      </CustomControl>

      {selectLocation && (
        <Marker
          lngLat={{
            lng: selectLocation.longitude,
            lat: selectLocation.latitude,
          }}
        >
          <Popover
            content={
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    const { longitude, latitude } = selectLocation;
                    resetFeatures([
                      ...features,
                      point([longitude, latitude], selectLocation),
                    ]);
                    setSelectLocation(undefined);
                  }}
                >
                  添加至数据
                </Button>
                <Button
                  danger
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setSelectLocation(undefined);
                  }}
                >
                  清除
                </Button>
              </div>
            }
          >
            <img style={{ width: 40, height: 40 }} src={colorImg?.src} />
          </Popover>
        </Marker>
      )}
    </>
  );
});

export default LocationSearchControl;
