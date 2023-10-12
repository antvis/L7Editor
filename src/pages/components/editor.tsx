import { ConfigProvider, theme as antdTheme } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
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
import { useGlobal } from '../../recoil';
import type { L7EditorProps } from '../../types';
import useStyle from './styles';

type EditorProps = L7EditorProps;

export const Editor: React.FC<EditorProps> = (props) => {
  const { onFeatureChange } = props;
  const { theme, mapOptions, setMapOptions, showIndex, locale } = useGlobal();
  const styles = useStyle();

  useEffect(() => {
    if (theme === 'dark') {
      setMapOptions({ ...mapOptions, style: 'dark' });
    } else {
      setMapOptions({ ...mapOptions, style: 'light' });
    }
  }, [theme]);

  const antdLocale = useMemo(
    () => LangList.find((lang) => lang.lang === locale)?.antd,
    [locale],
  );

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
