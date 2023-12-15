import { CustomControl } from '@antv/larkmap';
import { Form, Popover, Select, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeature, useGlobal } from '../../../recoil';
import { IconFont } from '../../iconfont';
import useStyles from '../styles';
import useStyle from './style';

export type TextLayerControlProps = {};

export const TextLayerControl: React.FC = () => {
  const styles = useStyles();
  const style = useStyle();
  const {
    showTextLayer,
    setShowTextLayer,
    textLayerFields,
    setTextLayerFields,
  } = useGlobal();
  const { features } = useFeature();
  const [fields, setFields] = useState<string[]>([]);
  const { t } = useTranslation();

  const refreshFields = () => {
    const newFieldSet = new Set<string>();
    features.forEach((feature) => {
      const properties = feature.properties;
      if (properties) {
        Object.keys(properties).forEach((key) => {
          newFieldSet.add(key);
        });
      }
    });
    setFields(Array.from(newFieldSet));
  };

  return (
    <CustomControl position="bottomleft">
      <Popover
        title={t('text-layer-control_wenBenBiaoZhu')}
        overlayStyle={{ width: 300 }}
        content={
          <Form size="small" className={style.textLayerForm}>
            <Form.Item label={t('text-layer-control_shiFouZhanShiTuCeng')}>
              <Switch value={showTextLayer} onChange={setShowTextLayer} />
            </Form.Item>

            <Form.Item label={t('text-layer-control_zhanShiZiDuan')}>
              <Select
                value={textLayerFields}
                onChange={setTextLayerFields}
                placeholder={t('text-layer-control_buXuan')}
                mode="multiple"
                options={fields.map((item) => {
                  return { label: item, value: item };
                })}
              />
            </Form.Item>
          </Form>
        }
        trigger="click"
        onOpenChange={(visible) => {
          if (visible) {
            refreshFields();
          }
        }}
      >
        <Tooltip
          placement="left"
          overlay={t('text-layer-control_wenBenTuCengPeiZhi')}
        >
          <button className={styles.L7EditorControl} id="text-layer-control">
            <IconFont type="icon-wenbenkuang" />
          </button>
        </Tooltip>
      </Popover>
    </CustomControl>
  );
};
