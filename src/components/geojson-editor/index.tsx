import { useDebounceEffect, useMount, useSize } from 'ahooks';
import type { editor } from 'monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import { useFeature, useGlobal } from '../../recoil';
import { isPromise } from '../../utils';
import { prettierText } from '../../utils/prettier-text';
import { provideCompletionItems } from './editortool';
import useStyle from './styles';

type Language = 'json' | 'javascript';

type EditorProps = {
  language?: Language;
  ref?: any;
};

export const GeoJsonEditor: React.FC<EditorProps> = forwardRef((props, ref) => {
  const { language = 'json' } = props;
  const { theme, autoFitBounds } = useGlobal();
  const { editorText, setEditorText, saveEditorText, bboxAutoFit } =
    useFeature();
  const [scriptContent, setScriptContent] = useState('');
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};
  const styles = useStyle();
  const [editorTextChange, setEditorTextChange] = useState('');
  const { t } = useTranslation();

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
        { token: t('geojson_editor.index.tiaoShi'), foreground: '959595' },
        { token: t('geojson_editor.index.tongZhi'), foreground: '00b4ff' },
        { token: t('geojson_editor.index.jingGao'), foreground: 'fff000' },
        { token: t('geojson_editor.index.cuoWu'), foreground: 'ff0000' },
        { token: t('geojson_editor.index.bengKui'), foreground: 'c30209' },
        { token: t('geojson_editor.index.xinXi'), foreground: 'ffffff' },
      ],
      colors: {
        'editor.background': '#fafafa',
        'editorLineNumber.foreground': '#222222',
        'editor.lineHighlightBackground': '#f4f4f4',
      },
    });

    // lodash 代码提示补全
    monacoEditor.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) =>
        provideCompletionItems(model, position, 'lodash'),
    });

    // turf 代码提示补全
    monacoEditor.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) =>
        provideCompletionItems(model, position, 'turf'),
    });
  });

  const monacoChange = (event: string) => {
    if (language === 'json') {
      setEditorText(event);
      setEditorTextChange(event);
      return;
    }
    setScriptContent?.(event);
  };

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve, reject) => {
          let geoData;
          const funcResult = new Function(scriptContent);
          if (funcResult()) {
            geoData = funcResult();
          } else {
            // eslint-disable-next-line no-eval
            const evalResult = eval(scriptContent);
            geoData = isPromise(evalResult) ? await evalResult : evalResult;
          }
          if (geoData) {
            resolve(geoData);
          } else {
            reject(t('geojson_editor.index.jiaoBenShuJuYou'));
          }
        }),
    }),
    [scriptContent, t],
  );

  useDebounceEffect(
    () => {
      const features = saveEditorText();
      if (autoFitBounds) {
        bboxAutoFit(features);
      }
    },
    [editorTextChange],
    { wait: 2000 },
  );

  const value = useMemo(() => {
    if (language === 'javascript') {
      return {};
    }
    return { value: editorText };
  }, [language, editorText]);

  return (
    <div ref={setContainer} className={styles.appEditor}>
      <MonacoEditor
        width={width}
        height={height}
        language={language}
        {...value}
        onChange={monacoChange}
        theme={theme === 'dark' ? 'vs-dark' : 'custome-theme'}
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
