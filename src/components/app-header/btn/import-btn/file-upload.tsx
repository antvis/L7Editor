import { FileTextOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { Geometry } from '@turf/turf';
import { feature, featureCollection } from '@turf/turf';
import type { UploadFile } from 'antd';
import { Form, Select, Tooltip, Upload, message } from 'antd';
import { cloneDeep } from 'lodash';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { parse } from 'wellknown';
import { FeatureCollectionVT } from '../../../../constants/variable-type';
import {
  isGeometry,
  isWkt,
  parserFileToSource,
} from '../../../../utils/upload';
import useStyle from '../../styles';

const { Dragger } = Upload;

const FileUpload = forwardRef<any>(function FileUpload({}, ref) {
  const [uploadData, setUploadData] = useState<Record<string, any>[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectList, setSelectList] = useState<Record<string, any>[]>([]);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const styles = useStyle();

  const customRequest = (uploadRequestOption: any) => {
    const { file, onSuccess, onError } = uploadRequestOption;
    parserFileToSource(file, t)
      .then((dataSource) => {
        if (!dataSource?.columns) {
          if (dataSource.data?.features?.length) {
            const newData = uploadData;
            newData.push({
              id: dataSource.id,
              features: dataSource.data.features,
            });
            setUploadData(newData);
          }
        } else {
          const wktValue = dataSource.data[0];
          let val: string | undefined = undefined;
          for (const key of Object.keys(wktValue)) {
            const values = wktValue[key];
            if (isWkt(values)) {
              form.setFieldValue(dataSource.id, key);
              val = key;
            } else if (isGeometry(values)) {
              form.setFieldValue(dataSource.id, key);
              val = key;
            }
          }
          if (val) {
            const data = dataSource?.data.map((value: any) => {
              //@ts-ignore
              return value[val];
            });
            const propertiesList = dataSource?.data.map((v: any) => {
              const properties = cloneDeep(v);
              //@ts-ignore
              delete properties[val];
              return { ...properties };
            });
            let newGeoJson = [];
            if (isWkt(data[0])) {
              newGeoJson = data.map((v: string, index: number) => {
                const geometry = parse(v) as Geometry;
                return feature(geometry, { ...propertiesList[index] });
              });
            } else if (isGeometry(data[0])) {
              newGeoJson = data.map((v: string, index: number) => {
                return feature(JSON.parse(v), { ...propertiesList[index] });
              });
            }
            const newDates = uploadData;
            newDates.push({ features: newGeoJson, id: dataSource?.id });
            setUploadData(newDates);
          }
          setSelectList((pre) => [...pre, dataSource]);
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
    [fileList, t, uploadData],
  );

  const selectItem = useMemo(() => {
    if (selectList.length) {
      const data = selectList.map((item, index) => {
        const options = item.columns.map((option: string | number) => {
          return {
            value: option,
            label: option,
          };
        });
        return (
          <Form.Item
            name={item.id}
            label={`${t('import_btn.file_upload.wenJian')}${index + 1}`}
            key={item.id}
          >
            <Select
              options={options}
              style={{ width: 300 }}
              onChange={(e) => {
                const newData1 = selectList.find((v) => v.id === item.id);
                const newData2 = newData1?.data.map((value: any) => {
                  return value[e];
                });
                const propertiesList = newData1?.data.map((v: any) => {
                  const properties = cloneDeep(v);
                  delete properties[e];
                  return { ...properties };
                });
                let newGeoJson = [];
                if (isWkt(newData2[0])) {
                  newGeoJson = newData2.map(
                    (v: string, geojsonIndex: number) => {
                      const geometry = parse(v) as Geometry;
                      return feature(geometry, {
                        ...propertiesList[geojsonIndex],
                      });
                    },
                  );
                } else if (isGeometry(newData2[0])) {
                  newGeoJson = newData2.map(
                    (v: string, geojsonIndex: number) => {
                      return feature(JSON.parse(v), {
                        ...propertiesList[geojsonIndex],
                      });
                    },
                  );
                } else {
                  message.error(
                    t('import_btn.file_upload.ciZiDuanFeiDiLiZiDuan'),
                  );
                }
                const newDates = uploadData.filter(
                  (updateItem) => updateItem.id !== newData1?.id,
                );
                newDates.push({ features: newGeoJson, id: newData1?.id });
                setUploadData(newDates);
              }}
            />
          </Form.Item>
        );
      });
      return data;
    }
  }, [selectList, t, uploadData]);

  return (
    <>
      <Form form={form}>
        <Form.Item
          name="file"
          rules={[{ required: true }]}
          style={{ marginTop: 16, marginBottom: 4 }}
        >
          <Dragger
            accept=".json,.geojson,.kml,.wkt,.csv,.xlsx,.xls"
            customRequest={customRequest}
            multiple
            onRemove={(file) => {
              const newData = uploadData.filter((item) => item.id !== file.uid);
              setUploadData(newData);
              const newSelect = selectList.filter(
                (item) => item.id !== file.uid,
              );
              setSelectList(newSelect);
              return true;
            }}
            onChange={(file) => {
              setFileList(file.fileList);
            }}
          >
            <div className={styles.upload}>
              <span style={{ fontSize: 40 }}>
                <FileTextOutlined />
              </span>
              <div>{t('import_btn.file_upload.dianJiHuoJiangWenJian')}</div>
            </div>
          </Dragger>
        </Form.Item>
        <div style={{ color: '#777' }}>
          {t('import_btn.file_upload.jinZhiChiJS')}
        </div>
        {selectList.length ? (
          <div style={{ display: 'flex' }}>
            <span className={styles.uploadTitle}>
              {t('import_btn.file_upload.diLiZiDuanXuanZe')}
            </span>
            <Tooltip title={t('import_btn.file_upload.dangQianJinZhiChi')}>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        ) : null}
        {selectItem}
      </Form>
    </>
  );
});

export default FileUpload;
