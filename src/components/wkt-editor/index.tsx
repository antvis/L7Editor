import { useMount, useSize } from 'ahooks';
import { editor } from 'monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useFeature } from '../../recoil';
import { prettierText } from '../../utils/prettier-text';
import useStyle from './styles';
// @ts-ignore
import wkt from 'wkt';

type Language = 'html';

type EditorProps = {
  language?: Language;
};

export const WktEditor: React.FC<EditorProps> = forwardRef((props) => {
  const { language = 'html' } = props;
  const { features ,wktText, setWktText} = useFeature();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};
  const styles = useStyle();

  // document format
  monacoEditor.languages.registerDocumentFormattingEditProvider(language, {
    provideDocumentFormattingEdits: (model: editor.ITextModel) => {
      return [
        {
          range: model.getFullModelRange(),
          text: prettierText({ content: model.getValue(), parser: language }),
        },
      ];
    },
  });

  useMount(() => {
    // 自定义主题(例子,可删除,没关系)
    monacoEditor.editor.defineTheme('custome-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: '调试', foreground: '959595' },
        { token: '通知', foreground: '00b4ff' },
        { token: '警告', foreground: 'fff000' },
        { token: '错误', foreground: 'ff0000' },
        { token: '崩溃', foreground: 'c30209' },
        { token: '信息', foreground: 'ffffff' },
      ],
      colors: {
        'editor.background': '#fafafa',
        'editorLineNumber.foreground': '#222222',
        'editor.lineHighlightBackground': '#f4f4f4',
      },
    });
  });

  // useEffect(() => {
  //   const wktArr = wktText.split('\n');
  //   console.log(wktArr, 1111);
  //   const geojson: Feature<any, any>[] = wktArr.map((item: string) => {
  //     const data: Feature<any, any> = {
  //       type: 'Feature',
  //       geometry: {},
  //       properties: {},
  //     };
  //     return { ...data, geometry: wkt.parse(item) };
  //   });
  //   const newGeojson = geojson.filter((item) => {
  //     return item.geometry;
  //   });
  //   console.log(prettierText({ content: newGeojson }));
  //   setEditorText(prettierText({ content: newGeojson }));
  // }, [wktText]);

  const monacoChange = (event: string) => {
    console.log(event);
    setWktText(event);
    // const wktArr = event.split('\n');
    // const geojson: Feature<any, any>[] = wktArr.map((item: string) => {
    //   const data: Feature<any, any> = {
    //     type: 'Feature',
    //     geometry: {},
    //     properties: {},
    //   };
    //   return { ...data, geometry: wkt.parse(item) };
    // });
    // const newGeojson = geojson.filter((item) => {
    //   return item.geometry;
    // });
    // console.log(prettierText({ content: newGeojson }));
    // setEditorText(prettierText({ content: newGeojson }));
    // setScriptContent?.(event);
  };

  useEffect(() => {
    const wktArr = features?.map((item: { geometry: any }) => {
      const geometry = item.geometry;
      const WKT = wkt.stringify(geometry);
      return WKT;
    });
    setWktText(wktArr?.join('\n'));
  }, [features]);

  const value = useMemo(() => {
    return { value: wktText };
  }, [language, wktText]);
  return (
    <div ref={setContainer} className={styles.appEditor}>
      <MonacoEditor
        width={width}
        height={height}
        language={language}
        {...value}
        onChange={monacoChange}
        theme="custome-theme"
        options={{
          selectOnLineNumbers: true,
          tabIndex: 2,
          tabSize: 2,
          folding: true,
          fontSize: 13,
          mouseStyle: 'text',
          foldingStrategy: 'indentation',
          scrollBeyondLastLine: false,
          foldingMaximumRegions: Number.MAX_SAFE_INTEGER,
          suggest: {
            showKeywords: true,
          },
        }}
      />
    </div>
  );
});
