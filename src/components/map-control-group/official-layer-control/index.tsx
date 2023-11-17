import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { CustomControl, RasterLayer } from '@antv/larkmap';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Upload,
  message,
} from 'antd';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GOOGLE_TILE_MAP_ROUTER_URL,
  GOOGLE_TILE_MAP_URL,
  OfficeLayerEnum,
} from '../../../constants';
import { useGlobal } from '../../../recoil';
import useStyle from './styles';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function OfficialLayerControl() {
  const [form] = Form.useForm();
  const styles = useStyle();
  const { layerType, setLayerType, customTiles, setCustomTiles } = useGlobal();
  const { t } = useTranslation();
  const [radioValue, setRadioValue] = useState<string>(
    layerType.length ? layerType[0] : OfficeLayerEnum.VectorMap,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [base64, setBase64] = useState<any>(null);

  const handleOk = () => {
    // setIsModalOpen(false);
    form.submit();
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const officeLayerGroup = useMemo(() => {
    return [
      {
        type: OfficeLayerEnum.VectorMap,
        title: t('official_layer_control.index.shiLiangDiTu'),
        image:
          'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*qdFDSbvIalgAAAAAAAAAAAAADmJ7AQ/original',
        layers: [],
      },
      {
        type: OfficeLayerEnum.GoogleSatellite,
        title: t('official_layer_control.index.guGeWeiXingTu'),
        image:
          'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*zi2jSqqZ2-8AAAAAAAAAAAAADjWqAQ/original',
        layers: [GOOGLE_TILE_MAP_URL, GOOGLE_TILE_MAP_ROUTER_URL],
      },
      ...customTiles,
    ];
  }, [t, customTiles]);

  const handleBeforeUpload = (file: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setBase64(base64Image);
    };
    return false; // 阻止antd组件自动上传
  };

  const onItemClick = (item: {
    type: any;
    image: string;
    title: string;
    layers: string[];
  }) => {
    setRadioValue(item.type);
    setLayerType(
      item.type === OfficeLayerEnum.VectorMap ? [] : ([item.type] as string[]),
    );
  };

  const onFinish = (e: any) => {
    if (
      officeLayerGroup.every((item) => {
        return item.title !== e.name;
      })
    ) {
      setIsModalOpen(false);
      setCustomTiles((prevState) => [
        ...prevState,
        {
          type: e.name,
          image: `${base64}`,
          title: e.name,
          layers: e.urls,
        },
      ]);
    } else {
      message.error(t('official_layer_control.index.mingChengChongFu'));
    }
  };

  const rasterLayer = useMemo(() => {
    if (layerType.length) {
      const findItem = officeLayerGroup.find(
        (item) => item.type === layerType[0],
      );
      return findItem?.layers.map((item) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <RasterLayer
            zIndex={1}
            id={
              findItem.type === OfficeLayerEnum.GoogleSatellite &&
              item === GOOGLE_TILE_MAP_URL
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

  const onConfirm = (
    e: any,
    item: { type: any; image?: string; title?: string; layers?: string[] },
  ) => {
    const newCustomTiles = customTiles.filter((val) => {
      return val.type !== item.type;
    });
    if (item.type === radioValue) {
      setRadioValue(OfficeLayerEnum.VectorMap);
      setLayerType([]);
    }
    setCustomTiles(newCustomTiles);
  };

  return (
    <>
      <CustomControl position="bottomleft">
        <div className={styles.mapTab}>
          <div className={styles.amapInfo}>
            {officeLayerGroup.map((item, index) => {
              return (
                <div
                  key={item.type}
                  className={classNames([
                    styles.amapInfoItem,
                    item.type === radioValue
                      ? styles.itemBorderActive
                      : styles.itemBorder,
                    index === officeLayerGroup.length - 1 ? 'item-hover' : '',
                  ])}
                  onClick={() => {
                    onItemClick(item);
                  }}
                >
                  {index > 1 && (
                    <Popconfirm
                      title={t('official_layer_control.index.shanChuDiTu')}
                      onConfirm={(e) => onConfirm(e, item)}
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
                  )}

                  <img
                    src={item.image}
                    alt=""
                    className={styles.amapInfoItemImage}
                  />
                  <div style={{ marginTop: 0 }}>{item.title}</div>
                </div>
              );
            })}
            <div className={classNames(['add-map'])}>
              <div
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <div className={styles.addMapIcon}>
                  <PlusOutlined />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title={t('official_layer_control.index.tianJiaDitu')}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={600}
        >
          <Form form={form} initialValues={{ urls: [''] }} onFinish={onFinish}>
            <Form.Item
              {...layout}
              name="name"
              label={t('official_layer_control.index.name')}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder={t('official_layer_control.index.addName')} />
            </Form.Item>
            <Form.Item
              {...layout}
              name="img"
              label={t('official_layer_control.index.shiLiTuPian')}
              rules={[{ required: true }]}
            >
              <Upload
                beforeUpload={handleBeforeUpload}
                accept=".png,.jpg"
                maxCount={1}
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
                        ]}
                        style={{ marginLeft: index === 0 ? 0 : 80 }}
                      >
                        <Input
                          placeholder={GOOGLE_TILE_MAP_URL}
                          style={{
                            width: 400,
                          }}
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item style={{ textAlign: 'center' }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{ width: 310 }}
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
      <div>{rasterLayer}</div>
    </>
  );
}
