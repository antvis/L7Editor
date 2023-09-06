import { parserTextFileToSource } from './file-to-source';
interface newFile extends File {
  uid: string;
}

export const parserFileToSource = async (file: newFile, t: any) => {
  const fileFullName = file.name;
  const fileNames = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
  const fileExtension = fileFullName.substring(
    fileFullName.lastIndexOf('.') + 1,
  );

  let dataSource;

  try {
    if (['csv', 'geojson', 'json', 'kml', 'wkt'].includes(fileExtension)) {
      dataSource = await parserTextFileToSource(
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
