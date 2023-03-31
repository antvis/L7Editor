import { isUndefined } from 'lodash';
import Color from 'color';
import dayjs from 'dayjs';
import { createFromIconfontCN } from '@ant-design/icons';
import { centroid, distance, Feature, Point, point, Polygon } from '@turf/turf';

export const getOpacityColor = (color: string, alpha: number) => {
  const colorInstance = Color(color).fade(alpha);
  return `rgba(${colorInstance.array().join(', ')})`;
};

/**
 * 下载内容
 * @param text
 * @param ext
 */
export const downloadText = (text: string, ext: string | 'json' | 'txt') => {
  let aTag = document.createElement('a');
  aTag.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  aTag.setAttribute(
    'download',
    `${dayjs().format('YYYY-HH-MM HH:mm:ss')}.${ext}`,
  );
  aTag.style.display = 'none';
  document.body.appendChild(aTag);
  aTag.click();
};

export const getParamsNew = (key: string) => {
  const temData = new URLSearchParams(window.location.search);
  return temData.get(key);
};

/**
 * 判断是否是Promise
 */

export const isPromise = (obj: any) => {
  return !isUndefined(obj) && obj instanceof Promise;
};

export const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_3567033_1q0gr6jx30qh.js',
});

const elementsAreEqual = (array: number[]) =>
  array.every((el) => el === array[0]);

/**
 * 判断是否为圆
 */

export const isCircle = (feature: Feature) => {
  const centre = centroid(feature);
  const arrPoint = feature.geometry.coordinates[0];
  const pointData = arrPoint.map((item: [number, number]) => {
    return point(item);
  });
  const pointDistance = pointData.map((item: Point) => {
    const data = distance(item, centre, { units: 'kilometers' });
    return parseInt(`${data}`);
  });
  if (pointDistance.length === 61) {
    return elementsAreEqual(pointDistance);
  }
  return false;
};

export const isRect = (feature: Feature) => {
  const arrPoint = feature.geometry.coordinates[0];
  const result = Array.from(new Set(arrPoint.flat(Infinity)));
  if (result.length === 4) {
    return true;
  }
  return false;
};

export * from './transform';
