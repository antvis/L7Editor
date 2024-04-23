import {
  CaretRightOutlined,
  DeleteOutlined,
  FormOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { CustomControl, RasterLayer } from '@antv/larkmap';
import { useLocalStorageState } from 'ahooks';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Form, Input, Modal, Popconfirm, Space, Upload } from 'antd';
import classNames from 'classnames';
import { cloneDeep } from 'lodash-es';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CN_GOOGLE_TILE_MAP_URL,
  GAODE_TILE_MAP_URL,
  GOOGLE_TILE_MAP_ROUTER_URL,
  GOOGLE_TILE_MAP_URL,
  OfficeLayerEnum,
} from '../../../constants';
import { useGlobal } from '../../../recoil';
import type { CustomTiles } from '../../../types/l7editor';
import useStyle from './styles';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const enLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

export function OfficialLayerControl() {
  const [form] = Form.useForm();
  const styles = useStyle();
  const { layerType, setLayerType, customTiles, setCustomTiles, locale } =
    useGlobal();
  const { t } = useTranslation();
  const [radioValue, setRadioValue] = useState<string>(
    layerType.length ? layerType[0] : OfficeLayerEnum.VectorMap,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [base64, setBase64] = useState<any>(
    'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*UwHYTrindekAAAAAAAAAAAAADjWqAQ/original',
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [hideOfficeLayer, setHideOfficeLayer] = useLocalStorageState<boolean>(
    'hideOfficeLayer',
    {
      defaultValue: true,
    },
  );

  const handleOk = () => {
    form.submit();
  };

  const BASE_LAYER_GROUP = [
    {
      id: OfficeLayerEnum.VectorMap,
      title: t('official_layer_control.index.shiLiangDiTu'),
      image:
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*qdFDSbvIalgAAAAAAAAAAAAADmJ7AQ/original',
      layers: [],
    },
    {
      id: OfficeLayerEnum.GoogleSatellite,
      title: t('official_layer_control.index.guGeWeiXingTu'),
      image:
        'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*vfeZTbq2KWgAAAAAAAAAAAAADjWqAQ/original',
      layers: [CN_GOOGLE_TILE_MAP_URL],
    },
    {
      id: OfficeLayerEnum.Google,
      title: t('official_layer_control.index.guGeWeiXingTuFanQiang'),
      image:
        'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*M64rSbdhYJ0AAAAAAAAAAAAADjWqAQ/original',
      layers: [GOOGLE_TILE_MAP_URL, GOOGLE_TILE_MAP_ROUTER_URL],
    },
    {
      id: OfficeLayerEnum.Gaode,
      title: t('official_layer_control.index.gaoDeWeiXingTu'),
      image:
        'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*zi2jSqqZ2-8AAAAAAAAAAAAADjWqAQ/original',
      layers: [GAODE_TILE_MAP_URL, GOOGLE_TILE_MAP_ROUTER_URL],
    },
  ];

  const officeLayerGroup = useMemo(() => {
    if (customTiles.length) {
      return [...BASE_LAYER_GROUP, ...customTiles];
    }
    return BASE_LAYER_GROUP;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customTiles, t]);

  const handleBeforeUpload = (file: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setBase64(base64Image);
    };
    return false; // 阻止antd组件自动上传
  };

  const onItemClick = (item: CustomTiles) => {
    setRadioValue(item.id);
    setLayerType(
      item.id === OfficeLayerEnum.VectorMap ? [] : ([item.id] as string[]),
    );
  };

  const onFinish = (e: any) => {
    if (isEdit) {
      const cloneCustomTiles = cloneDeep(customTiles);
      const newImgUrl = Array.isArray(e.img) ? e.img[0].url : `${base64}`;
      cloneCustomTiles[editIndex - BASE_LAYER_GROUP.length] = {
        id: e.name,
        image: newImgUrl,
        title: e.name,
        layers: e.urls,
      };
      setCustomTiles(cloneCustomTiles);
      setIsEdit(false);
      setEditIndex(-1);
    } else {
      setCustomTiles((prevState) => [
        ...prevState,
        {
          id: e.name,
          image: `${base64}`,
          title: e.name,
          layers: e.urls,
        },
      ]);
    }
    setIsEdit(false);
    setFileList([]);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setFileList([]);
    setEditIndex(-1);
    form.resetFields();
  };

  const onConfirm = (
    e: React.MouseEvent<HTMLElement> | undefined,
    item: CustomTiles,
  ) => {
    e?.stopPropagation();
    const newCustomTiles = customTiles.filter((val) => {
      return val.id !== item.id;
    });
    if (item.id === radioValue) {
      setRadioValue(OfficeLayerEnum.VectorMap);
      setLayerType([]);
    }
    setCustomTiles(newCustomTiles);
  };

  const validateSpace = (_: any, value: string) => {
    const lowerCaseValue = value.toLowerCase();
    let listArr = [];
    if (isEdit) {
      const cloneOfficeLayerGroup = cloneDeep(officeLayerGroup);
      cloneOfficeLayerGroup.splice(editIndex, 1);
      listArr = [...cloneOfficeLayerGroup];
    } else {
      listArr = officeLayerGroup;
    }
    const hasDuplicate = listArr.every(
      (item) => item.title.toLowerCase() !== lowerCaseValue,
    );
    if (!hasDuplicate) {
      return Promise.reject(t('official_layer_control.index.mingChengChongFu'));
    }
    if (value && value.trim() === '') {
      return Promise.reject(t('official_layer_control.index.kongGe'));
    }
    return Promise.resolve();
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-2);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  const rasterLayer = useMemo(() => {
    if (layerType.length) {
      const findItem = officeLayerGroup.find(
        (item) => item.id === layerType[0],
      );
      return findItem?.layers.map((item) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <RasterLayer
            zIndex={1}
            id={
              findItem.id === OfficeLayerEnum.GoogleSatellite &&
              item === CN_GOOGLE_TILE_MAP_URL
                ? 'googleTileMap'
                : undefined
            }
            source={{
              data: item,
              parser: { type: 'rasterTile', tileSize: 256, zoomOffset: 0 },
            }}
          />
        );
      });
    } else {
      return null;
    }
  }, [layerType, officeLayerGroup]);

  return (
    <>
      <CustomControl position="bottomleft">
        <div className={styles.mapTab} id="l7-editor-aMap">
          <div
            className={styles.hideOfficeLayerBtn}
            onClick={() => {
              setHideOfficeLayer(!hideOfficeLayer);
            }}
          >
            <CaretRightOutlined
              style={
                hideOfficeLayer ? { transform: 'rotate(-180deg)' } : undefined
              }
            />
          </div>
          {hideOfficeLayer && (
            <div className={styles.amapInfo}>
              {officeLayerGroup.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className={classNames([
                      styles.amapInfoItem,
                      item.id === radioValue
                        ? styles.itemBorderActive
                        : styles.itemBorder,
                      index === officeLayerGroup.length - 1 ? 'item-hover' : '',
                    ])}
                    onClick={() => {
                      onItemClick(item);
                    }}
                  >
                    {index >= BASE_LAYER_GROUP.length && (
                      <>
                        <Popconfirm
                          title={t('official_layer_control.index.shanChuDiTu')}
                          onConfirm={(e) => onConfirm(e, item)}
                          onCancel={(
                            e: React.MouseEvent<HTMLElement> | undefined,
                          ) => {
                            e?.stopPropagation();
                          }}
                        >
                          <div
                            className={'item-clear'}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <DeleteOutlined />
                          </div>
                        </Popconfirm>
                        <div
                          className={'item-edit'}
                          onClick={(e) => {
                            setEditIndex(index);
                            e.stopPropagation();
                            setIsEdit(true);
                            setIsModalOpen(true);
                            setFileList([
                              {
                                uid: '-1',
                                name: `${item.title}`,
                                status: 'done',
                                url: item.image,
                              },
                            ]);
                            form.setFieldsValue({
                              name: item.title,
                              urls: item.layers,
                              img: [
                                {
                                  uid: '-1',
                                  name: `${item.title}`,
                                  status: 'done',
                                  url: item.image,
                                },
                              ],
                            });
                          }}
                        >
                          <FormOutlined />
                        </div>
                      </>
                    )}
                    <img
                      src={item.image}
                      alt=""
                      className={styles.amapInfoItemImage}
                    />
                    <div
                      className={styles.amapInfoItemTitle}
                      style={{ marginTop: 0 }}
                    >
                      {item.title}
                    </div>
                  </div>
                );
              })}
              <div className="add-map">
                <div
                  onClick={() => {
                    setIsModalOpen(true);
                    form.resetFields();
                  }}
                >
                  <div className={styles.addMapIcon}>
                    <PlusOutlined />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal
          title={t('official_layer_control.index.tianJiaDitu')}
          open={isModalOpen}
          destroyOnClose
          onOk={handleOk}
          onCancel={handleCancel}
          width={600}
        >
          <Form form={form} initialValues={{ urls: [''] }} onFinish={onFinish}>
            <Form.Item
              {...(locale === 'zh-CN' ? layout : enLayout)}
              name="name"
              label={t('official_layer_control.index.name')}
              rules={[{ required: true }, { validator: validateSpace }]}
            >
              <Input
                placeholder={t('official_layer_control.index.addName')}
                style={{
                  width: 390,
                }}
              />
            </Form.Item>
            <Form.Item
              {...(locale === 'zh-CN' ? layout : enLayout)}
              name="img"
              label={t('official_layer_control.index.shiLiTuPian')}
            >
              <Upload
                beforeUpload={handleBeforeUpload}
                accept=".png,.jpg"
                maxCount={1}
                onChange={handleChange}
                fileList={fileList}
                onRemove={() => {
                  setFileList([]);
                }}
              >
                <Button icon={<UploadOutlined />}>
                  {t('import_btn.index.shangChuan')}
                </Button>
              </Upload>
            </Form.Item>
            <Form.List name="urls">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...field}
                        label={
                          index === 0
                            ? t('official_layer_control.index.tuCengDiZhi')
                            : ''
                        }
                        rules={[
                          {
                            required: true,
                            message: t(
                              'official_layer_control.index.qiShuRutuCengDiZhi',
                            ),
                          },
                          { validator: validateSpace },
                        ]}
                        style={{
                          marginLeft:
                            locale === 'zh-CN'
                              ? index === 0
                                ? 10
                                : 90
                              : index === 0
                              ? 18
                              : 134,
                        }}
                      >
                        <Input
                          placeholder={CN_GOOGLE_TILE_MAP_URL}
                          style={{
                            width: 390,
                          }}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Space>
                  ))}
                  <Form.Item style={{ textAlign: 'center' }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{
                        width: 390,
                        marginLeft: locale === 'zh-CN' ? 20 : 104,
                      }}
                    >
                      {t('official_layer_control.index.tinJiaWaPian')}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </CustomControl>
      <>{rasterLayer}</>
    </>
  );
}
