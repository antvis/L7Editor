import { L7Editor } from '@antv/l7-editor';
import React from 'react';
import './index.less';

export default () => {
  // const { loading, data: isChina = true } = useRequest(async () => {
  //   const { short_name: countryCode } = await fetch(
  //     'https://ip.useragentinfo.com/json',
  //   ).then((res) => res.json());

  //   return countryCode === 'CN';
  // });

  return (
    <div className="editor">
      <L7Editor activeTab="geojson" />
    </div>
  );
};
