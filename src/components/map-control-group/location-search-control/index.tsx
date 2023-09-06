import { CustomControl, Marker, useScene } from '@antv/larkmap';
import { point } from '@turf/turf';
import { useAsyncEffect } from 'ahooks';
import { Button, Popover } from 'antd';
import Color from 'color';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeature, useGlobal } from '../../../recoil';
import { getPointImage } from '../../../utils/change-image-color';
import { LocationSearch } from './location-search';
import { LocationSearchOption } from './types';

const LocationSearchControl: React.FC = React.memo(() => {
  const scene = useScene();
  const [selectLocation, setSelectLocation] = useState<LocationSearchOption>();
  const [locationText, setLocationText] = useState('');
  const { features, resetFeatures } = useFeature();
  const { layerColor } = useGlobal();
  const [colorImg, setColorImg] = useState<HTMLImageElement | undefined>();
  const { t } = useTranslation();

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
      <CustomControl position="lefttop">
        <div id="l7-editor-citySelect" style={{ display: 'flex' }}>
          <div>
            <div>
              <div>
                <LocationSearch
                  getPopupContainer={() =>
                    document.querySelector('.larkmap') as HTMLElement
                  }
                  allowClear
                  value={selectLocation?.name}
                  searchParams={{
                    key: '98d10f05a2da96697313a2ce35ebf1a2',
                    location: locationText,
                  }}
                  onChange={(_, item) => {
                    if (item) {
                      const currentZoom = scene.getZoom();
                      scene.setZoomAndCenter(
                        currentZoom > 16 ? currentZoom : 16,
                        [item.longitude, item.latitude],
                      );
                    }
                    setSelectLocation(item);
                  }}
                />
              </div>
            </div>
          </div>
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
                  {t('location_search_control.index.tianJiaZhiShuJu')}
                </Button>
                <Button
                  danger
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setSelectLocation(undefined);
                  }}
                >
                  {t('app_header.constants.qingChu')}
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
