import I18N from '@/locales';
import { useLnglat } from '../../../../recoil';
import { featureCollection } from '@turf/turf';
import { Form, Input, Radio } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';
import { LngLatImportType } from '../../../../types';

const LngLatImportTypeOptions: Array<{
  label: string;
  value: LngLatImportType;
}> = [
  {
    label: I18N.t('import_btn.lnglat_import_btn.dian'),
    value: 'Point',
  },
  {
    label: I18N.t('import_btn.lnglat_import_btn.xian'),
    value: 'LingString',
  },
  {
    label: I18N.t('import_btn.lnglat_import_btn.mian'),
    value: 'Polygon',
  },
];
const LngLatImportBtn = forwardRef(({}, ref) => {
  const {
    lngLatText,
    setLngLatText,
    importLngLatText,
    lngLatImportType,
    setLngLatImportType,
  } = useLnglat();

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (!lngLatText) {
            reject(I18N.t('import_btn.lnglat_import_btn.qingShuRuJingWei'));
          }
          const data = importLngLatText(lngLatText);
          resolve(featureCollection(data));
          reject(I18N.t('import_btn.lnglat_import_btn.lNGLA'));
        }),
    }),
    [lngLatText, lngLatImportType],
  );

  return (
    <>
      <Form>
        <Form.Item style={{ marginTop: 16 }} label={I18N.t('import_btn.lnglat_import_btn.shuJuLeiXing')}>
          <Radio.Group
            value={lngLatImportType}
            buttonStyle="solid"
            onChange={(e) => {
              setLngLatImportType(e.target.value);
            }}
          >
            {LngLatImportTypeOptions.map((item) => (
              <Radio.Button key={item.value} value={item.value}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item style={{ marginTop: 16 }} label={I18N.t('import_btn.lnglat_import_btn.shuJuNeiRong')}>
          <Input.TextArea
            placeholder={I18N.t('import_btn.lnglat_import_btn.qingShuRuLianXu')}
            rows={10}
            onChange={(e) => {
              setLngLatText(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
});

export default LngLatImportBtn;
