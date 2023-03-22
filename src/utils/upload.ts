import { getUniqueId, parserTextFileToSource } from './fileToSource';

export const parserFileToSource = async (file: File) => {
  const fileFullName = file.name;
  const fileNames = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
  const fileExtension = fileFullName.substring(
    fileFullName.lastIndexOf('.') + 1,
  );

  let dataSource;

  try {
    if (['csv', 'geojson', 'json'].includes(fileExtension)) {
      dataSource = await parserTextFileToSource(
        file,
        fileNames,
        getUniqueId(fileNames),
      );
    }
  } catch (e) {
    return Promise.reject('文件解析失败，请检查文件格式。');
  }

  return dataSource;
};
