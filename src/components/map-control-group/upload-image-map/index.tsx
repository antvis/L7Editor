import { PlusOutlined } from '@ant-design/icons';
import { CustomControl } from '@antv/larkmap';
import { lineString } from '@turf/turf';
import {
  Button,
  Form,
  GetProp,
  Image,
  Input,
  Modal,
  Popconfirm,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconFont } from '../../../components/iconfont';
import { useFeature } from '../../../recoil';
import useStyle from '../styles';

const { TextArea } = Input;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const UploadImageMapControl = () => {
  const styles = useStyle();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const { imageMask, setImageMask, bboxAutoFit } = useFeature();

  useEffect(() => {
    if (isModalOpen) {
      const { text = '', file = '' } = JSON.parse(imageMask ?? '') ?? {};
      const defaultFile = file ? JSON.parse(file) : {};
      setTextValue(text);
      setPreviewImage(defaultFile.url);
      setFileList(file ? [defaultFile] : []);
    }
  }, [isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onReset = () => {
    setFileList([]);
    setPreviewOpen(false);
    setPreviewImage('');
    setTextValue('');
  };

  const handleOk = () => {
    if (!fileList.length && textValue) {
      message.error('请上传文件');
      return;
    }

    if (!textValue && fileList.length) {
      message.error('请输入经纬度');
      return;
    }

    let flag = -1;
    let errorField = '';
    const lonlat = textValue
      .split(';')
      .map((item: string) => item.split(',').map(Number));
    lonlat.forEach((item: number[], index) => {
      const [lon, lat] = item;
      if (180 < lon || lon < -180) {
        flag = index;
        errorField = '经度';
      }
      if (90 < lat || lat < -90) {
        flag = index;
        errorField = '维度';
      }
    });

    if (flag > -1) {
      message.error(`第${flag + 1}组数据${errorField}有误`);
      return;
    }

    if (lonlat.length > 4) {
      message.error('最多只能上传4组经纬度');
      return;
    }

    setImageMask(
      JSON.stringify({ text: textValue, file: JSON.stringify(fileList[0]) }),
    );
    onReset();
    setIsModalOpen(false);
    if (textValue) {
      const line = lineString(lonlat);
      bboxAutoFit([line]);
    }
  };

  const handleCancel = () => {
    onReset();
    setIsModalOpen(false);
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async () => {
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({
    file,
    fileList: changeFileList,
  }) => {
    if (!changeFileList.length) {
      setFileList([]);
      return;
    }
    const { uid, name } = file;
    if (!file?.url && !file?.preview) {
      file.preview = await getBase64(file?.originFileObj as FileType);
    }
    setPreviewImage(file?.url || (file?.preview as string));
    setFileList([
      {
        uid,
        name: name ?? '图片',
        status: 'done',
        url: file?.url || (file?.preview as string),
      },
    ]);
  };
  return (
    <CustomControl position="bottomleft">
      <Tooltip placement="left" overlay={t('l7Options.shangChuanDiTuTuPian')}>
        <button
          className={styles.L7EditorControl}
          id="text-layer-control"
          onClick={showModal}
        >
          <IconFont type="icon-quanjuyanmo" />
        </button>
      </Tooltip>
      <Modal
        title={t('l7Options.shangChuanDiTuTuPian')}
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        destroyOnClose
        footer={
          <>
            <Popconfirm
              title={t('clear_control.index.queRenQingKongSuo')}
              onConfirm={() => {
                onReset();
              }}
            >
              <Button>{t('app_header.constants.qingChu')}</Button>
            </Popconfirm>
            <Button onClick={handleCancel}>
              {t('btn.setting_btn.guanBi')}
            </Button>
            <Button type="primary" id="l7-option-copy_btn" onClick={handleOk}>
              {t('btn.setting_btn.queRen')}
            </Button>
          </>
        }
      >
        <Form layout="vertical" labelAlign="left">
          <Form.Item label={t('upload.text.tuPianShangChuan')}>
            <Upload
              action=""
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              maxCount={1}
            >
              <Button>
                <PlusOutlined />
                {t('upload.text.tuPianShangChuan')}
              </Button>
            </Upload>
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
              }}
              src={previewImage}
            />
          )}
          <Form.Item label={t('shangChuanDiTuTuPian.TextArea.lonlat')}>
            <TextArea
              rows={3}
              placeholder={`${t(
                'shangChuanDiTuTuPian.TextArea.placeholder',
              )}：101.16971,41.377836;100.959388,41.619522;100.900015,41.424628;101.229887,41.572654`}
              value={textValue}
              onChange={(e) => {
                setTextValue(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </CustomControl>
  );
};
