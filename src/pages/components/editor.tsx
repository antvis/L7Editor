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
import { LocalStorageKey } from '../../constants';
import { LangList } from '../../locales';
import { useFeature, useGlobal } from '../../recoil';
import type { L7EditorProps } from '../../types';
import useStyle from './styles';

type EditorProps = L7EditorProps;

export const Editor: React.FC<EditorProps> = (props) => {
  const { onFeatureChange } = props;
  const { i18n, t } = useTranslation();
  const { theme, mapOptions, setMapOptions, showIndex, locale } = useGlobal();
  const styles = useStyle();
  const { saveEditorText, bboxAutoFit, scene } = useFeature();

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    () => LangList.find((lang) => lang.lang === locale)?.antd!,
    [locale],
  );

  useAsyncEffect(async () => {
    const newEditorText = (await localforage.getItem(
      LocalStorageKey.EditorText,
    )) as string | null;
    if (newEditorText && scene && !props.features) {
      const newFeatures = await JSON.parse(newEditorText).features;
      bboxAutoFit(newFeatures);
    } else {
      bboxAutoFit();
    }
  }, [scene]);

  useAsyncEffect(async () => {
    const newEditorText = (await localforage.getItem(
      LocalStorageKey.EditorText,
    )) as string | null;
    if (newEditorText && !props.features) {
      saveEditorText(newEditorText);
    }
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
