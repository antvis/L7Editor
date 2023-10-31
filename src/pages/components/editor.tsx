import { useAsyncEffect, useUpdateEffect } from 'ahooks';
import { ConfigProvider, theme as antdTheme } from 'antd';
import classNames from 'classnames';
import localforage from 'localforage';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppHeader,
  AppMap,
  LayerContextmenuPopup,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '../../components';
import { EditorTextLayer } from '../../components/text-layer';
import { LangList } from '../../locales';
import { useFeature, useGlobal } from '../../recoil';
import type { L7EditorProps } from '../../types';
import useStyle from './styles';

type EditorProps = L7EditorProps;

export const Editor: React.FC<EditorProps> = (props) => {
  const { onFeatureChange } = props;
  const { i18n } = useTranslation();
  const { theme, mapOptions, setMapOptions, showIndex, locale } = useGlobal();
  const { resetFeatures } = useFeature();
  const styles = useStyle();

  useUpdateEffect(() => {
    if (theme === 'dark') {
      setMapOptions({ ...mapOptions, style: 'dark' });
    } else {
      setMapOptions({ ...mapOptions, style: 'light' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const antdLocale = useMemo(
    //@ts-ignore
    () => LangList.find((lang) => lang.lang === locale)?.antd,
    [locale],
  );

  useAsyncEffect(async () => {
    localforage
      .getItem('features')
      .then(function (value: any) {
        // 当值被存储后，可执行其他操作
        if (value && !props?.features)
          resetFeatures(JSON.parse(value).features);
      })
      .catch(function (err) {
        // 当出错时，此处代码运行
        console.log(err);
      });
  }, []);

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        algorithm:
          theme === 'dark'
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      <div
        className={classNames([styles.l7Editor, 'l7-editor'])}
        id="l7-editor"
      >
        <AppHeader toolbar={props.toolbar} />
        <ResizePanel
          onFeatureChange={(e) => {
            if (onFeatureChange) {
              onFeatureChange(e);
            }
          }}
          left={
            <AppMap>
              <MapControlGroup mapControl={props.mapControl} />
              {showIndex && <EditorTextLayer />}
              <LayerList />
              <LayerPopup />
              <LayerContextmenuPopup />
            </AppMap>
          }
          right={
            <MapContent tabItems={props?.tabItems} features={props?.features} />
          }
        />
      </div>
    </ConfigProvider>
  );
};
