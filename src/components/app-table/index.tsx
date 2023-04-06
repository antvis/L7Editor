import { prettierText } from '@/utils/prettier-text';
import { featureCollection } from '@turf/turf';
import { useSize } from 'ahooks';
import { Empty, Form, Input, InputNumber, Table, Typography } from 'antd';
import { isNull, isUndefined, uniqBy } from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
const { Text } = Typography;

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

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

const EditableContext = React.createContext<any>(null);
const EditableRow = ({ index, ...props }: any) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  inputType,
  handleSave,
  newDataSource,
  ...restProps
}: any) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue(
      inputType !== 'object'
        ? {
            [dataIndex]: record[dataIndex],
          }
        : { [dataIndex]: JSON.stringify(record[dataIndex]) },
    );
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      const newValues =
        (await inputType) === 'object'
          ? { dataIndex: JSON.parse(values[dataIndex]) }
          : values;
      toggleEdit();
      handleSave({
        ...record,
        ...newValues,
        newValues,
      });
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
        rules={[
          {
            required: true,
            message: `请输入内容`,
          },
        ]}
      >
        {inputType === 'number' ? (
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
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

export const AppTable = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};
  const { features, setFeatures, setEditorText } = useModel('feature');
  const [newDataSource, setNewDataSource] = useState<any>([]);

  useEffect(() => {
    const dataSource = features.map((item, index) => {
      const { properties } = item;
      return { __index: index + 1, ...properties };
    });
    setNewDataSource(dataSource);
  }, [features]);

  const defaultColumns = useMemo(() => {
    const newColumns: (ColumnTypes[number] & {
      editable?: boolean;
      dataIndex: string;
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
          <Text
            style={key.length > 20 ? { width: 170 } : undefined}
            ellipsis={{ tooltip: key }}
          >
            {key}
          </Text>
        ),
        dataIndex: key,
        key: `${key}${index}`,
        align: 'center',
        width: key.length > 20 ? 200 : 100,
        editable: true,
        render: formatTableValue,
        filters: options.length ? options : undefined,
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
    const indexData = { ...features[__index - 1], properties: indexProperties };
    features.splice(__index - 1, 1, indexData);
    setFeatures(features);
    setEditorText(prettierText({ content: featureCollection(features) }));
    setNewDataSource(newData);
  };

  const newColumns = useMemo(() => {
    const columns = defaultColumns.map((col) => {
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
          handleSave,
        }),
      };
    });
    return columns;
  }, [defaultColumns]);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }} ref={container}>
      {newColumns?.length ? (
        <Table
          components={components}
          columns={newColumns as any}
          dataSource={newDataSource}
          scroll={{ x: width, y: height - 54 }}
        />
      ) : (
        <Empty description="当前数据无字段" style={{ margin: '12px 0' }} />
      )}
    </div>
  );
};
