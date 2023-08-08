import { CloudDownloadOutlined } from '@ant-design/icons';
import { coordAll, featureCollection } from '@turf/turf';
import { Button, Dropdown } from 'antd';
import React from 'react';
import { downloadText } from '../../../utils';
import { prettierText } from '../../../utils/prettier-text';
import { useFeature } from './../../../recoil';
import { DownloadMenuItems } from '../constants';
// @ts-ignore
import tokml from 'tokml';
// @ts-ignore
import wkt from 'wkt';

const DownloadBtn: React.FC = () => {
  const { editorText, features } = useFeature();

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
    } else if (key === 'KML') {
      const kml = tokml(fc);
      downloadText(kml, 'kml');
    } else if (key === 'WKT') {
      const wktArr = features.map((item: { geometry: any }) => {
        const geometry = item.geometry;
        const WKT = wkt.stringify(geometry);
        return WKT;
      });
      downloadText(wktArr.join('\n'), 'wkt');
    } else {
      downloadText(editorText as string, 'json');
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
      <Button id="l7-editor-driver-download" icon={<CloudDownloadOutlined />}>
        下载
      </Button>
    </Dropdown>
  );
};

export default DownloadBtn;
