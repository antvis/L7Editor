import { featureCollection } from '@turf/turf';
import { Form, Input, Radio } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useLnglat } from '../../../../recoil';
import type { LngLatImportType } from '../../../../types';

const LngLatImportBtn = forwardRef(({}, ref) => {
  const {
    lngLatText,
    setLngLatText,
    importLngLatText,
    lngLatImportType,
    setLngLatImportType,
  } = useLnglat();
  const { t } = useTranslation();

  const LngLatImportTypeOptions: {
    label: string;
    value: LngLatImportType;
  }[] = [
    {
      label: t('import_btn.lnglat_import_btn.dian'),
      value: 'Point',
    },
    {
      label: t('import_btn.lnglat_import_btn.xian'),
      value: 'LingString',
    },
    {
      label: t('import_btn.lnglat_import_btn.mian'),
      value: 'Polygon',
    },
  ];

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (!lngLatText) {
            reject(t('import_btn.lnglat_import_btn.qingShuRuJingWei'));
          }
          const data = importLngLatText(lngLatText);
          resolve(featureCollection(data));
          reject(t('import_btn.lnglat_import_btn.lNGLA'));
        }),
    }),
    [lngLatText, importLngLatText, t],
  );

  return (
    <>
      <Form>
        <Form.Item
          style={{ marginTop: 16 }}
          label={t('import_btn.lnglat_import_btn.shuJuLeiXing')}
        >
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
        <Form.Item
          style={{ marginTop: 16 }}
          label={t('import_btn.lnglat_import_btn.shuJuNeiRong')}
        >
          <Input.TextArea
            placeholder={t('import_btn.lnglat_import_btn.qingShuRuLianXu')}
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
