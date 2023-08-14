import { FeatureCollectionVT } from '../constants';
// @ts-ignore
import togeojson from '@mapbox/togeojson';
// @ts-ignore
import { uniqueId } from 'lodash';
import { Wkt2GeoJSON } from './wkt';

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
