import { GeometryVT } from '../constants';
import {
  csv2json,
  parserExcelFileToSource,
  parserTextFileToSource,
} from './file-to-source';
interface newFile extends File {
  uid: string;
}

export const isWkt = (data: string) => {
  // Detecting WKT in text reference: https://en.wikipedia.org/wiki/Well-known_text
  // string start with POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON [Z] ( and end with )
  const regExp =
    /^(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON)(\sz)?\s?\(.*\)$/i;
  let iswktField = false;
  if (typeof data === 'string' && regExp.test(data)) {
    iswktField = true;
  }

  return iswktField;
};

export const isGeometry = (data: string) => {
  try {
    const json = JSON.parse(data);
    return GeometryVT.check(json);
  } catch {
    return false;
  }
};

export const parserFileToSource = async (file: newFile, t: any) => {
  const fileFullName = file.name;
  const fileNames = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
  const fileExtension = fileFullName.substring(
    fileFullName.lastIndexOf('.') + 1,
  );

  let dataSource;

  try {
    if (['geojson', 'json', 'kml', 'wkt'].includes(fileExtension)) {
      dataSource = await parserTextFileToSource(
        file,
        fileNames,
        file.uid as string,
      );
    } else if (fileExtension === 'csv') {
      dataSource = await csv2json(file, fileNames, file.uid as string);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      dataSource = await parserExcelFileToSource(
        file,
        fileNames,
        file.uid as string,
      );
    }
  } catch (e) {
    return Promise.reject(t('utils.upload.wenJianJieXiShi'));
  }

  return dataSource;
};
