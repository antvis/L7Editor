import { L7Editor } from '@antv/l7-editor';
import { useRequest } from 'ahooks';
import React from 'react';
import './index.less';

export default () => {
  const { loading, data: isChina = true } = useRequest(async () => {
    const { short_name: countryCode } = await fetch(
      'https://ip.useragentinfo.com/json',
    ).then((res) => res.json());

    return countryCode === 'CN';
  });

  return (
    <div className="editor">
      {!loading && (
        <L7Editor
          baseMap={isChina ? 'Gaode' : 'Mapbox'}
          locale={isChina ? 'zh-CN' : 'en-US'}
          coordConvert={isChina ? 'GCJ02' : 'WGS84'}
          mapControl={
            isChina
              ? undefined
              : {
                  administrativeSelectControl: false,
                  locationSearchControl: false,
                  mapAdministrativeControl: false,
                }
          }
        />
      )}
    </div>
  );
};
