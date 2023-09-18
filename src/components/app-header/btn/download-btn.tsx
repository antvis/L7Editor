import { CloudDownloadOutlined } from '@ant-design/icons';
import { coordAll } from '@turf/turf';
import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { downloadText } from '../../../utils';
import { prettierText } from '../../../utils/prettier-text';
import { useFeature } from './../../../recoil';
// @ts-ignore
import tokml from 'tokml';
import { GeoJSON2Wkt } from '../../../utils/wkt';

const DownloadBtn: React.FC = () => {
  const { editorText, fc } = useFeature();
  const { t } = useTranslation();
  const onDownload = (key: string) => {
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
      downloadText(GeoJSON2Wkt(fc), 'wkt');
    } else {
      downloadText(editorText as string, 'json');
    }
  };

  const DownloadMenuItems: MenuProps['items'] = [
    {
      key: 'GeoJson',
      label: t('app_header.constants.xiaZaiGEO'),
    },
    {
      key: 'LngLat',
      label: t('app_header.constants.xiaZaiLNG'),
    },
    {
      key: 'KML',
      label: t('app_header.constants.xiaZaiKML'),
    },
    {
      key: 'WKT',
      label: t('app_header.constants.xiaZaiWKT'),
    },
  ];

  return (
    <Dropdown
      menu={{
        items: DownloadMenuItems,
        onClick: ({ key }) => {
          onDownload(key);
        },
      }}
    >
      <Button id="l7-editor-download" icon={<CloudDownloadOutlined />}>
        {t('btn.download_btn.xiaZai')}
      </Button>
    </Dropdown>
  );
};

export default DownloadBtn;
