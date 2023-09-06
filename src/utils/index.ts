import { getSingleColorStyle } from '@antv/l7-draw';
import { FeatureCollectionVT, FeatureKey, LayerZIndex } from '../constants';
//@ts-ignore
import togeojson from '@mapbox/togeojson';
import { bearing, center, coordAll, distance, Feature } from '@turf/turf';
import { message } from 'antd';
import Color from 'color';
import dayjs from 'dayjs';
import { isUndefined } from 'lodash-es';
// @ts-ignore
import { Wkt2GeoJSON } from './wkt';

export const getOpacityColor = (color: string, alpha: number) => {
  const colorInstance = Color(color).fade(alpha);
  return `rgba(${colorInstance.array().join(', ')})`;
};

export const getDrawStyle = (color: string) => {
  const style = getSingleColorStyle(color);
  Object.keys(style).forEach((key) => {
    // @ts-ignore
    style[key].options = {
      // @ts-ignore
      ...style[key].options,
      zIndex: LayerZIndex,
    };
  });
  return style;
};

/**
 * 下载内容
 * @param text
 * @param ext
 */
export const downloadText = (text: string, ext: string | 'json' | 'txt') => {
  const aTag = document.createElement('a');
  aTag.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  aTag.setAttribute('download', `${dayjs().format('YYYY-MM-DD')}.${ext}`);
  aTag.style.display = 'none';
  document.body.appendChild(aTag);
  aTag.click();
};

export const getParamsNew = (key: string) => {
  const temData = new URLSearchParams(window.location.search);
  return temData.get(key);
};

export const getUrlFeatureCollection = async (
  url: string,
  urlType: string = 'GeoJSON',
  t: any,
) => {
  const json = await fetch(url);
  if (urlType === 'GeoJSON') {
    try {
      const geoData = await json.json();
      return geoData;
    } catch (e) {
      throw new Error(t('utils.index.qingJianChaUR'));
    }
  } else if (urlType === 'WKT') {
    const wktStr = await json.text();
    const geojson = Wkt2GeoJSON(wktStr);
    if (FeatureCollectionVT.check(geojson)) {
      return geojson;
    } else {
      message.error(t('utils.index.qingJianChaUR'));
    }
  } else if (urlType === 'KML') {
    const KML = await json.text();
    const xml = new DOMParser().parseFromString(KML, 'text/xml');
    if (xml.getElementsByTagName('parsererror').length > 0) {
      message.error(t('utils.index.qingJianChaUR'));
    } else {
      const geojson = await togeojson.kml(xml, {
        style: true,
      });
      return geojson;
    }
  }
};

/**
 * 判断是否是Promise
 */

export const isPromise = (obj: any) => {
  return !isUndefined(obj) && obj instanceof Promise;
};

/**
 * 判断是否为圆
 */

export const isCircle = (feature: Feature) => {
  // @ts-ignore
  const drawType = feature.properties?.[FeatureKey.DrawType];
  if (drawType === 'circle') {
    return true;
  }
  const centerPosition = center(feature).geometry.coordinates;
  const distanceList = coordAll(feature).map((position) => {
    return Math.round(
      distance(position, centerPosition, {
        units: 'meters',
      }),
    );
  });
  return Array.from(new Set(distanceList)).length === 1;
};

export const isRect = (feature: Feature) => {
  // @ts-ignore
  const drawType = feature.properties?.[FeatureKey.DrawType];
  if (drawType === 'rect') {
    return true;
  }
  const positions = coordAll(feature);
  const line1 = distance(positions[0], positions[1], {
    units: 'meters',
  }).toFixed(0);
  const line2 = distance(positions[1], positions[2], {
    units: 'meters',
  }).toFixed(0);
  const line3 = distance(positions[2], positions[3], {
    units: 'meters',
  }).toFixed(0);
  const line4 = distance(positions[3], positions[4], {
    units: 'meters',
  }).toFixed(0);
  if (line1 === line3 && line2 === line4) {
    const degree = Math.round(
      bearing(positions[0], positions[3]) - bearing(positions[0], positions[1]),
    );
    return degree === 90 || degree === 270;
  }
  return false;
};

export * from './gcoord';
export * from './lnglat';
export * from './transform';
export * from './wkt';
