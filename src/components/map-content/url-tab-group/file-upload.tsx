import { FeatureCollectionVT } from '@/constants/variable-type';
import { parserFileToSource } from '@/utils/upload';
import { UploadOutlined } from '@ant-design/icons';
import { featureCollection } from '@turf/turf';
import { Button, Form, message, Upload, UploadFile } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const FileUpload = forwardRef<any>(function FileUpload({}, ref) {
  const [uploadData, setUploadData] = useState<Record<string, any>[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const customRequest = (uploadRequestOption: any) => {
    const { file, onSuccess, onError } = uploadRequestOption;
    parserFileToSource(file)
      .then((dataSource) => {
        if (dataSource.data.features.length) {
          const newData = uploadData;
          newData.push({
            id: dataSource.id,
            features: dataSource.data.features,
          });
          setUploadData(newData);
        }
        // @ts-ignore
        onSuccess();
      })
      .catch(() => {
        onError();
        message.error('数据格式不匹配');
      });
  };

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (!uploadData.length) {
            reject('请添加文件');
          }
          const isErrorList = fileList.filter(
            (item: any) => item.status === 'error',
          );
          if (!!isErrorList.length) {
            reject('请删除报错文件');
          }
          const data = uploadData.map((item) => item.features).flat();
          if (FeatureCollectionVT.check(featureCollection(data))) {
            resolve(featureCollection(data));
          } else {
            message.info('请检查数据格式');
          }
        }),
    }),
    [fileList],
  );

  return (
    <>
      <Form>
        <Form.Item
          name="file"
          label="文件上传"
          rules={[{ required: true }]}
          style={{ marginTop: 16, marginBottom: 4 }}
        >
          <Upload
            accept=".json,.geojson,.kml"
            customRequest={customRequest}
            multiple
            onRemove={(file) => {
              const newData = uploadData.filter((item) => item.id !== file.uid);
              setUploadData(newData);
              return true;
            }}
            onChange={(file) => {
              setFileList(file.fileList);
            }}
          >
            <Button icon={<UploadOutlined />}>文件上传</Button>
          </Upload>
        </Form.Item>
      </Form>
      <div style={{ color: '#777' }}>仅支持.json, .geojson 后缀的文件</div>
    </>
  );
});

export default FileUpload;
