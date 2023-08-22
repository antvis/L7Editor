import { CustomControl, useScene } from '@antv/larkmap';
import classNames from 'classnames';
import { debounce, intersection } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import useStyle from './styles';

export const MapAdministrativeControl: React.FC = () => {
  const [administrative, setAdministrative] = useState(' ');
  const scene = useScene();
  const styles = useStyle();

  useEffect(() => {
    const onMapChange = async () => {
      if (!scene) {
        return;
      }
      const getPointAddress = (lng: number, lat: number) => {
        return new Promise<string[]>((resolve, reject) => {
          fetch(
            `https://restapi.amap.com/v3/geocode/regeo?key=98d10f05a2da96697313a2ce35ebf1a2&location=${lng},${lat}`,
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.status === '1') {
                const { country, province, city, district, township } =
                  data.regeocode.addressComponent;
                resolve(
                  [country, province, city, district, township].filter(
                    (item) => typeof item === 'string' && item,
                  ),
                );
              } else {
                reject(data);
              }
            });
        });
      };
      const [point1, point2] = scene.getBounds();

      const [address1, address2] = await Promise.all([
        getPointAddress(...point1),
        getPointAddress(...point2),
      ]);
      setAdministrative(intersection(address1, address2).join(' '));
    };
    const onDebounceMapChange = debounce(onMapChange, 500, {
      maxWait: 500,
    });
    onMapChange();
    scene?.on('mapchange', onDebounceMapChange);
    return () => {
      scene?.off('mapchange', onDebounceMapChange);
    };
  }, [scene]);

  return (
    <CustomControl
      className={classNames([
        'map-administrative-control',
        styles.mapAdministrative,
      ])}
      position="bottomleft"
    >
      {administrative}
    </CustomControl>
  );
};
