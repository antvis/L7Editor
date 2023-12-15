import { CustomControl } from '@antv/larkmap';
import { Form, Popover, Select, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useFeature, useGlobal } from '../../../recoil';
import { IconFont } from '../../iconfont';
import useStyles from '../styles';

export type TextLayerControlProps = {};

export const TextLayerControl: React.FC = () => {
  const styles = useStyles();
  const {
    showTextLayer,
    setShowTextLayer,
    textLayerFields,
    setTextLayerFields,
  } = useGlobal();
  const { features } = useFeature();
  const [fields, setFields] = useState<string[]>([]);

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
        title="文本标注图层配置"
        overlayStyle={{ width: 300 }}
        content={
          <Form size="small">
            <Form.Item label="是否展示图层">
              <Switch value={showTextLayer} onChange={setShowTextLayer} />
            </Form.Item>

            <Form.Item label="展示字段">
              <Select
                value={textLayerFields}
                onChange={setTextLayerFields}
                placeholder="不选则默认展示元素序号"
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
        <Tooltip placement="left" overlay="文本图层配置">
          <button className={styles.L7EditorControl} id="text-layer-control">
            <IconFont type="icon-wenbenkuang" />
          </button>
        </Tooltip>
      </Popover>
    </CustomControl>
  );
};
