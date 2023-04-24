import { FeatureCollectionVT } from '@/constants';
import togeojson from '@mapbox/togeojson';
import wkt from 'wkt';
/**
 * 生成唯一 ID
 */
export const getUniqueId = (prefix?: string) => {
  const unique = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );

  return prefix ? `${prefix}_${unique}` : unique;
};

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
  try {
    originData = JSON.parse(content) as GeoJSON.FeatureCollection;
  } catch (e) {
    throw e;
  }
  return {
    id: id || getUniqueId(id),
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
  try {
    data = JSON.parse(content);
  } catch (e) {
    throw e;
  }

  // 兼容 geojson 文件
  if (FeatureCollectionVT.check(data)) {
    return parserGeoJson(content, name, id);
  }
  return {
    id: id || getUniqueId(id),
    metadata: { name },
    data,
    type: 'local',
  };
};

// /**
//  * 解析 CSV 文件数据至数据集格式
//  */
// export const parserCSVToSource = (
//   content: string,
//   name: string,
//   id?: string,
// ) => {
//   let data: Record<string, any>[];
//     console.log(content,'content')
//   try {
//     data =
//       papaparse.parse<any>(content, { header: true, skipEmptyLines: true })
//         .data ?? [];
//   } catch (e) {
//     throw e;
//   }

//   return {
//     id: id || getUniqueId(id),
//     metadata: { name },
//     data,
//     type: 'local',
//   };
// };

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

  try {
    content = await readFileAsText(file);
  } catch (e) {
    throw e;
  }
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
      id: id || getUniqueId(id),
      metadata: { name },
      data: geojson,
      type: 'local',
    };
  } else if (fileExtension === 'wkt') {
    const wktArr = content.split('\n');
    const geojson = wktArr.map((item: string) => {
      const data = {
        type: 'Feature',
        geometry: {},
        properties: {},
      };
      return { ...data, geometry: wkt.parse(item) };
    });
    return {
      id: id || getUniqueId(id),
      metadata: { name },
      data: {
        type: 'FeatureCollection',
        features: geojson,
      },
      type: 'local',
    };
  }
};
