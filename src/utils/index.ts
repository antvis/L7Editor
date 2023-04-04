import { createFromIconfontCN } from '@ant-design/icons';
import { area, center, coordAll, distance, Feature } from '@turf/turf';
import Color from 'color';
import dayjs from 'dayjs';
import { isUndefined } from 'lodash';

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

/**
 * 判断是否为圆
 */

export const isCircle = (feature: Feature) => {
  // const centre = centroid(feature);
  // const centerPoint = centre.geometry.coordinates;
  // const positionList = coordAll(feature);
  // console.log(centre);
  // const distanceList = positionList.map((item) => {
  //   return Math.round(distance(centerPoint, item, { units: 'kilometers' }));
  // });
  const centerPosition = center(feature).geometry.coordinates;

  const distanceList = coordAll(feature).map((position) => {
    return Math.round(
      distance(position, centerPosition, {
        units: 'kilometers',
      }),
    );
  });
  console.log(area(feature));
  console.log(distanceList);
};

export const isRect = (feature: Feature) => {
  const arrPoint = feature.geometry.coordinates[0];
  const result = Array.from(new Set(arrPoint.flat(Infinity)));
  if (
    result.length === 4 &&
    arrPoint[0][0] === arrPoint[1][0] &&
    arrPoint[1][1] === arrPoint[2][1] &&
    arrPoint[2][0] === arrPoint[3][0] &&
    arrPoint[3][1] === arrPoint[4][1]
  ) {
    return true;
  }
  return false;
};

export * from './transform';
