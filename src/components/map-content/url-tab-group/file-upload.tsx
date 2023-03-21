import { parserFileToSource } from '@/utils/upload';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Upload, UploadFile } from 'antd';
import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';

const FileUpload = forwardRef<any>(function FileUpload({}, ref) {
  const [uploadData, setUploadData] = useState<any>([]);
  const [upLoadFileList, setUpLoadFileList] = useState<UploadFile[]>([]);

  const customRequest = (uploadRequestOption: any) => {
    const { file, onSuccess } = uploadRequestOption;
    parserFileToSource(file as File)
      .then((dataSource) => {
        if (dataSource.data.features.length) {
          setUploadData((pre: any) => {
            return [...pre, ...dataSource.data.features];
          });
        }
        // @ts-ignore
        onSuccess();
      })
      .catch((errorMessage) => {
        message.error(errorMessage);
      });
  };
  useImperativeHandle(ref, () => ({
    data: uploadData,
  }));
  return (
    <Form.Item
      name="file"
      label="文件上传"
      rules={[{ required: true }]}
      style={{ marginTop: 16 }}
    >
      <Upload
        accept=".json,.csv,.geojson"
        customRequest={customRequest}
        showUploadList={false}
        multiple
        fileList={upLoadFileList}
        onChange={(file) => {
          setUpLoadFileList(file.fileList);
        }}
      >
        <Button icon={<UploadOutlined />}>文件上传</Button>
      </Upload>
    </Form.Item>
  );
});

export default FileUpload;
