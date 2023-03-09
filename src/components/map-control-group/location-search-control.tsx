import {
  CustomControl,
  LocationSearch,
  LocationSearchOption,
  Marker,
  useScene,
} from '@antv/larkmap';
import { point } from '@turf/turf';
import { useModel } from '@umijs/max';
import { Button, Popover } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

const LocationSearchControl: React.FC = React.memo(() => {
  const scene = useScene();
  const [selectLocation, setSelectLocation] = useState<LocationSearchOption>();
  const [locationText, setLocationText] = useState('');
  const { features, resetFeatures } = useModel('feature');

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

  return (
    <>
      <CustomControl className="l7-location-search" position="topright">
        <LocationSearch
          getPopupContainer={() => document.querySelector('.larkmap')}
          style={{ width: 200 }}
          value={selectLocation?.name}
          searchParams={{
            key: '4892acc9f825e343bcf1e25a56199826',
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
                  添加至 GeoJSON
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
            <img
              style={{ width: 30, height: 30 }}
              src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*mvOqTLxNOEAAAAAAAAAAAAAADmJ7AQ/original"
            />
          </Popover>
        </Marker>
      )}
    </>
  );
});

export default LocationSearchControl;
