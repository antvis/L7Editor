import { isUndefined } from 'lodash';
import Color from 'color';
import dayjs from 'dayjs';
import { createFromIconfontCN } from '@ant-design/icons';

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

export * from './transform';
