//@ts-ignore
import { useFeature } from '@/recoil';
import { Scene } from '@antv/l7';
import { bbox, center, Feature, featureCollection } from '@turf/turf';
import { useSize } from 'ahooks';
import {
  Empty,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { isNull, isUndefined, uniqBy } from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FeatureKey } from '../../constants';
import { prettierText } from '../../utils/prettier-text';
import useStyle from './styles';

const { Text } = Typography;

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

type EditableCellType = {
  editable: boolean;
  children: any;
  dataIndex: string;
  record: any;
  inputType: string;
  handleSave: (value: any) => void;
  features: Feature[];
  scene: Scene;
  isDraw: boolean;
};

const formatTableValue = (value: any) => {
  if (isNull(value) || isUndefined(value)) {
    return '-';
  }
  return value instanceof Object ? (
    JSON.stringify(value)
  ) : (
    <Text style={{ width: 100 }} ellipsis={{ tooltip: String(value) }}>
      {String(value)}
    </Text>
  );
};

const FormContext = React.createContext<FormInstance | null>(null);
const EditableRow = (props: any) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <FormContext.Provider value={form}>
        <tr {...props} />
      </FormContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  editable,
  children,
  dataIndex,
  record,
  inputType,
  handleSave,
  features,
  scene,
  isDraw,
  ...restProps
}: EditableCellType) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const styles = useStyle();
  const form = useContext(FormContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    if (scene && !isDraw) {
      const bboxFit = features.find((item: any) => {
        return item.properties[FeatureKey.Index] === record[FeatureKey.Index];
      });
      if (bboxFit) {
        if (
          bboxFit.geometry.type === 'Point' ||
          bboxFit.geometry.type === 'MultiPoint'
        ) {
          const content = center(bboxFit);
          scene.setCenter(content.geometry.coordinates as [number, number]);
        } else {
          const content = bbox(bboxFit);
          scene.fitBounds([
            [content[0], content[1]],
            [content[2], content[3]],
          ]);
        }
      }
      setEditing(!editing);
      form?.setFieldsValue(
        inputType !== 'object'
          ? {
              [dataIndex]: record[dataIndex],
            }
          : { [dataIndex]: JSON.stringify(record[dataIndex]) },
      );
    }
  };

  const save = async () => {
    try {
      const fieldValue =
        inputType !== 'object'
          ? {
              [dataIndex]: record[dataIndex],
            }
          : { [dataIndex]: JSON.stringify(record[dataIndex]) };
      const values = await form?.validateFields();
      if (JSON.stringify(values) !== JSON.stringify(fieldValue)) {
        const newValues =
          inputType === 'object'
            ? { [dataIndex]: JSON.parse(values[dataIndex]) }
            : values;
        toggleEdit();
        handleSave({
          ...record,
          ...newValues,
          newValues,
        });
      } else {
        toggleEdit();
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        {inputType === 'number' ? (
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className={!isDraw ? styles.editableCellValueWrap : ''}
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

export const AppTable = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const { height = 0 } = useSize(container) ?? {};
  const { setEditorText, isDraw, scene, features, resetFeatures } =
    useFeature();
  const [newDataSource, setNewDataSource] = useState<any>([]);

  useEffect(() => {
    const dataSource = features.map((item, index) => {
      const { properties } = item;
      return { __index: index + 1, ...properties };
    });
    setNewDataSource(dataSource);
  }, [features]);

  const defaultColumns = useMemo(() => {
    const newColumns: (ColumnTypes[any] & {
      editable?: boolean;
      dataIndex?: string;
    })[] = [];
    const featureKeyList = Array.from(
      new Set(
        features
          .map((item) => {
            const { properties } = item;
            return Object.keys(properties);
          })
          .flat(),
      ),
    );

    if (featureKeyList) {
      newColumns.push({
        title: '序号',
        dataIndex: '__index',
        key: `__index`,
        width: 80,
        align: 'center',
        fixed: 'left',
        sorter: (a: any, b: any) => a['__index'] - b['__index'],
      });
    }

    featureKeyList.forEach((key, index) => {
      const options = uniqBy(
        newDataSource
          .map((item: any) => item[key])
          .map((value: any) => {
            return {
              text: formatTableValue(value),
              value: value,
            };
          }),
        'text',
      );
      newColumns.push({
        title: (
          <Tooltip title={key}>
            <Text
              style={{ overflow: 'hidden', width: 70 }}
              ellipsis={{ tooltip: key }}
            >
              {key}
            </Text>
          </Tooltip>
        ),
        width: 200,
        align: 'center',
        dataIndex: key,
        key: `${key}${index}`,
        editable: true,
        render: formatTableValue,
        filters: options.length ? options : (undefined as any),
        onFilter: (value: any, record: any) => {
          return (record[key] ?? '') === value;
        },
        filterSearch: true,
        sorter: !options.length
          ? (a: any, b: any) => {
              return (
                (typeof a[key] === 'string' || !a[key] ? 0 : a[key]) -
                (typeof b[key] === 'string' || !b[key] ? 0 : b[key])
              );
            }
          : undefined,
      });
    });
    newColumns.push({
      title: '操作',
      key: 'action',
      width: 70,
      align: 'center',
      fixed: 'right',
      render: (_, record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              resetFeatures(
                features.filter((_, index) => {
                  return index !== record[FeatureKey.Index];
                }),
              );
              message.success('数据删除成功');
            }}
          >
            删除
          </a>
        </Space>
      ),
    });
    return newColumns;
  }, [features, newDataSource]);

  const handleSave = (row: any) => {
    const newData = [...newDataSource];
    const index = newData.findIndex((item) => row.__index === item?.__index);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    const { __index, newValues } = row;
    const indexProperties = {
      ...features[__index - 1].properties,
      ...newValues,
    };
    const feature = { ...features[__index - 1], properties: indexProperties };
    features[index] = feature;
    setEditorText(prettierText({ content: featureCollection(features) }));
    setNewDataSource(newData);
  };

  const newColumns = defaultColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: typeof record[col.dataIndex],
        newDataSource,
        features,
        scene,
        isDraw,
        handleSave,
      }),
    };
  });

  return (
    <div style={{ width: '100%', height: '100%' }} ref={container}>
      {newDataSource?.length ? (
        <Table
          components={components}
          columns={newColumns}
          rowClassName={() => 'editable-row'}
          dataSource={newDataSource}
          bordered
          scroll={{ y: height - 54, x: 'max-content' }}
          size="small"
          pagination={false}
          rowKey={'__index'}
        />
      ) : (
        <Empty description="当前数据无字段" style={{ margin: '12px 0' }} />
      )}
    </div>
  );
};
