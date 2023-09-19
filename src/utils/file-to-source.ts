import { FeatureCollectionVT } from '../constants';
// @ts-ignore
import togeojson from '@mapbox/togeojson';
// @ts-ignore
import { uniqueId } from 'lodash-es';
import { Wkt2GeoJSON } from './wkt';
//@ts-ignore
import papaparse from 'papaparse';
import { read as XLSX_read, utils as XLSX_utils } from 'xlsx';

export const readFileAsText = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event) => {
      const result = event.target?.result as string;
      resolve(result);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/* 解析 geojson 文件数据至数据集格式
 */
export const parserGeoJson = (content: string, name: string, id?: string) => {
  let originData: GeoJSON.FeatureCollection;

  originData = JSON.parse(content) as GeoJSON.FeatureCollection;

  return {
    id: id || uniqueId(id),
    metadata: { name },
    data: originData,
    type: 'local',
  };
};

/**
 * 解析 json 文件数据至数据集格式
 */
export const parserJsonToGeoJson = (
  content: string,
  name: string,
  id?: string,
) => {
  let data: Record<string, any>[];

  data = JSON.parse(content);

  // 兼容 geojson 文件
  if (FeatureCollectionVT.check(data)) {
    return parserGeoJson(content, name, id);
  }
  return {
    id: id || uniqueId(id),
    metadata: { name },
    data,
    type: 'local',
  };
};

/* 解析文本文件至数据集格式
 * 文本文件有： json geojson csv
 */
export const parserTextFileToSource = async (
  file: File,
  name: string,
  id?: string,
): Promise<any> => {
  const fileFullName = file.name;
  const fileExtension = fileFullName.substring(
    fileFullName.lastIndexOf('.') + 1,
  );
  let content: string;
  content = await readFileAsText(file);

  if (fileExtension === 'json') {
    return parserJsonToGeoJson(content, name, id);
  } else if (fileExtension === 'geojson') {
    return parserGeoJson(content, name, id);
  } else if (fileExtension === 'kml') {
    const xml = new DOMParser().parseFromString(content, 'text/xml');
    const geojson = await togeojson.kml(xml, {
      style: true,
    });
    return {
      id: id || uniqueId(id),
      metadata: { name },
      data: geojson,
      type: 'local',
    };
  } else if (fileExtension === 'wkt') {
    const geojson = Wkt2GeoJSON(content);
    return {
      id: id || uniqueId(id),
      metadata: { name },
      data: geojson,
      type: 'local',
    };
  }
};

export const csv2json = async (
  file: File,
  name: string,
  id?: string,
): Promise<any> => {
  const fileFullName = file.name;
  const fileExtension = fileFullName.substring(
    fileFullName.lastIndexOf('.') + 1,
  );
  let content: string;
  content = await readFileAsText(file);

  const result = papaparse.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  return {
    id: id || uniqueId(id),
    metadata: { name },
    data: result.data,
    type: 'local',
    columns: result.meta.fields,
  };
};

export const readFileAsArrayBuffer = (file: File) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (event) => {
      const result = event.target?.result as ArrayBuffer;
      resolve(result);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/* 解析 excel 文件数据至数据集格式
 */
export const parserExcelToSource = (
  content: ArrayBuffer,
  name: string,
  id?: string,
): any => {
  let data: Record<string, any>[];

  try {
    const workbook = XLSX_read(content, { type: 'array', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // 日期格式直接处理为字符串
    Object.keys(sheet).forEach((key) => {
      const item = sheet[key];
      if (item.t === 'd') {
        item.v = item.w;
      }
    });

    // 默认只解析第一个工作簿
    data = XLSX_utils.sheet_to_json<Record<string, any>>(sheet);
  } catch (e) {
    throw e;
  }
  const columns = Object.keys(data[0]);
  return {
    id: id,
    metadata: { name },
    data: data,
    type: 'local',
    columns: columns,
  };
};

/* 解析 excel 文件至数据集格式
 */
export const parserExcelFileToSource = async (
  file: File,
  name: string,
  id?: string,
): Promise<any> => {
  let content: ArrayBuffer;

  try {
    content = await readFileAsArrayBuffer(file);
  } catch (e) {
    throw e;
  }

  return parserExcelToSource(content, name, id);
};
