import { parserFileToSource } from '@/utils/upload';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Upload, UploadFile } from 'antd';
import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';

const FileUpload = forwardRef<any>(function FileUpload({}, ref) {
  const [uploadData, setUploadData] = useState<any>([]);

  const customRequest = (uploadRequestOption: any) => {
    const { file, onSuccess, onError } = uploadRequestOption;
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
      .catch(() => {
        onError();
        message.error('数据格式不匹配');
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
        accept=".json,.geojson"
        customRequest={customRequest}
        multiple
        onRemove={() => true}
      >
        <Button icon={<UploadOutlined />}>文件上传</Button>
      </Upload>
    </Form.Item>
  );
});

export default FileUpload;
