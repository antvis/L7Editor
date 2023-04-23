import { getUniqueId, parserTextFileToSource } from './fileToSource';
interface newFile extends File {
  uid: string;
}

export const parserFileToSource = async (file: newFile) => {
  console.log(file)
  const fileFullName = file.name;
  const fileNames = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
  const fileExtension = fileFullName.substring(
    fileFullName.lastIndexOf('.') + 1,
  );

  let dataSource;

  try {
    if (['csv', 'geojson', 'json' , 'kml'].includes(fileExtension)) {
      
      dataSource = await parserTextFileToSource(
        file,
        fileNames,
        file.uid as string,
      );
    }
  } catch (e) {
    return Promise.reject('文件解析失败，请检查文件格式。');
  }

  return dataSource;
};
