import { UploadOutlined } from '@ant-design/icons';
import { featureCollection } from '@turf/turf';
import { Button, Form, message, Upload, UploadFile } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureCollectionVT } from '../../../../constants/variable-type';
import { parserFileToSource } from '../../../../utils/upload';

const FileUpload = forwardRef<any>(function FileUpload({}, ref) {
  const [uploadData, setUploadData] = useState<Record<string, any>[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { t } = useTranslation();
  const customRequest = (uploadRequestOption: any) => {
    const { file, onSuccess, onError } = uploadRequestOption;
    parserFileToSource(file, t)
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
        message.error(t('import_btn.file_upload.shuJuGeShiBu'));
      });
  };

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (!uploadData.length) {
            reject(t('import_btn.file_upload.qingTianJiaWenJian'));
          }
          const isErrorList = fileList.filter(
            (item: any) => item.status === 'error',
          );
          if (!!isErrorList.length) {
            reject(t('import_btn.file_upload.qingShanChuBaoCuo'));
          }
          const data = uploadData.map((item) => item.features).flat();
          if (FeatureCollectionVT.check(featureCollection(data))) {
            resolve(featureCollection(data));
          } else {
            message.info(t('import_btn.file_upload.qingJianChaShuJu'));
          }
        }),
    }),
    [fileList],
  );

  return (
    <>
      <Form layout={'vertical'}>
        <Form.Item
          name="file"
          label={t('import_btn.file_upload.wenJianShangChuan2')}
          rules={[{ required: true }]}
          style={{ marginTop: 16, marginBottom: 4 }}
        >
          <Upload
            accept=".json,.geojson,.kml,.wkt"
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
            <Button icon={<UploadOutlined />}>
              {t('import_btn.file_upload.wenJianShangChuan')}
            </Button>
          </Upload>
        </Form.Item>
      </Form>
      <div style={{ color: '#777' }}>
        {t('import_btn.file_upload.jinZhiChiJS')}
      </div>
    </>
  );
});

export default FileUpload;
