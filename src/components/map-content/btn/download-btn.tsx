import { CloudDownloadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { downloadText } from '@/utils';
import { coordAll, featureCollection } from '@turf/turf';
import { prettierText } from '@/utils/prettier-text';

const DownloadMenuItems: MenuProps['items'] = [
  {
    key: 'GeoJson',
    label: '下载压缩的 GeoJson 格式数据',
  },
  {
    key: 'FormatGeoJson',
    label: '下载格式化的 GeoJson 格式数据',
  },
  {
    key: 'LngLat',
    label: '下载 LngLat 格式数据',
  },
  {
    key: 'Text',
    label: '下载当前编辑器输入数据',
  },
];

const DownloadBtn: React.FC = () => {
  const { features, editorText } = useModel('feature');

  const onDownload = (key: string) => {
    const fc = featureCollection(features);
    if (key === 'GeoJson') {
      downloadText(JSON.stringify(fc), 'json');
    } else if (key === 'FormatGeoJson') {
      const newText = prettierText({ content: fc });
      downloadText(newText, 'json');
    } else if (key === 'LngLat') {
      downloadText(
        coordAll(fc)
          .map((lngLat) => lngLat.join(','))
          .join(';'),
        'txt',
      );
    } else {
      downloadText(editorText, 'json');
    }
  };

  return (
    <Dropdown
      menu={{
        items: DownloadMenuItems,
        onClick: ({ key }) => {
          onDownload(key);
        },
      }}
    >
      <Button icon={<CloudDownloadOutlined />}></Button>
    </Dropdown>
  );
};

export default DownloadBtn;
