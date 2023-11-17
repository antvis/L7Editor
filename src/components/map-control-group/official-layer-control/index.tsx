import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { CustomControl, RasterLayer } from '@antv/larkmap';
import { Button, Form, Input, Modal, Space, Upload, message } from 'antd';
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
  const { layerType, setLayerType, tileArr, setTileArr } = useGlobal();
  const { t } = useTranslation();
  const [radioValue, setRadioValue] = useState<string>(
    layerType.length ? layerType[0] : OfficeLayerEnum.VectorMap,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [base64, setBase64] = useState<any>(null);

  const handleOk = () => {
    // setIsModalOpen(false);
    form.submit();
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
      ...tileArr,
    ];
  }, [t, tileArr]);

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
      setTileArr((prevState) => [
        ...prevState,
        {
          type: e.name,
          image: `${base64}`,
          title: e.name,
          layers: e.urls,
        },
      ]);
    } else {
      message.error('名称重复，请修改名称');
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
          title="添加瓦片图层"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} initialValues={{ urls: [''] }} onFinish={onFinish}>
            <Form.Item
              {...layout}
              name="name"
              label="名称"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...layout}
              name="img"
              label="示例图片"
              rules={[{ required: true }]}
            >
              <Upload
                beforeUpload={handleBeforeUpload}
                accept=".png,.jpg"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>上传</Button>
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
                        label={index === 0 ? '图层地址' : ''}
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder={GOOGLE_TILE_MAP_URL}
                          style={{
                            width: 310,
                            marginLeft: index === 0 ? 0 : 80,
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
                      添加瓦片图层地址
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
