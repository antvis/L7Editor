import { useSize } from 'ahooks';
// import { editor } from 'monaco-editor';
// import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
// import 'monaco-editor/esm/vs/language/json/monaco.contribution';
// import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
// import MonacoEditor from 'react-monaco-editor';
import Editor, { loader, Monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';
import { useFeature, useGlobal } from '../../recoil';
import { isPromise, prettierText } from '../../utils';
import useStyle from './styles';

loader.config({
  monaco: monacoEditor,
});

type Language = 'json' | 'javascript';

type EditorProps = {
  language?: Language;
  ref?: any;
};

export const GeoJsonEditor: React.FC<EditorProps> = forwardRef((props, ref) => {
  const { language = 'json' } = props;
  const { theme } = useGlobal();
  const { editorText, setEditorText } = useFeature();
  const [scriptContent, setScriptContent] = useState('');
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};
  const styles = useStyle();

  const onBeforeMount = (monaco: Monaco) => {
    monaco.languages.registerDocumentFormattingEditProvider('json', {
      provideDocumentFormattingEdits: (
        model: monacoEditor.editor.ITextModel,
      ) => {
        return [
          {
            range: model.getFullModelRange(),
            text: prettierText({ content: model.getValue(), parser: 'json' }),
          },
        ];
      },
    });
  };

  // document format

  // useMount(() => {
  //   // 自定义主题(例子,可删除,没关系)
  //   monacoEditor.editor.defineTheme('custome-theme', {
  //     base: 'vs',
  //     inherit: true,
  //     rules: [
  //       { token: '调试', foreground: '959595' },
  //       { token: '通知', foreground: '00b4ff' },
  //       { token: '警告', foreground: 'fff000' },
  //       { token: '错误', foreground: 'ff0000' },
  //       { token: '崩溃', foreground: 'c30209' },
  //       { token: '信息', foreground: 'ffffff' },
  //     ],
  //     colors: {
  //       'editor.background': '#fafafa',
  //       'editorLineNumber.foreground': '#222222',
  //       'editor.lineHighlightBackground': '#f4f4f4',
  //     },
  //   });

  //   // lodash 代码提示补全
  //   monacoEditor.languages.registerCompletionItemProvider(language, {
  //     provideCompletionItems: (model, position) =>
  //       provideCompletionItems(model, position, 'lodash'),
  //   });

  //   // turf 代码提示补全
  //   monacoEditor.languages.registerCompletionItemProvider(language, {
  //     provideCompletionItems: (model, position) =>
  //       provideCompletionItems(model, position, 'turf'),
  //   });
  // });

  const monacoChange = (event: string) => {
    if (language === 'json') {
      setEditorText(event);
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
            reject('脚本数据有误');
          }
        }),
    }),
    [scriptContent],
  );

  return (
    <div ref={setContainer} className={styles.appEditor}>
      {/* <MonacoEditor
        width={width}
        height={height}
        language={language}
        value={language === 'javascript' ? undefined : editorText}
        onChange={monacoChange}
        theme={theme === 'normal' ? 'custome-theme' : 'vs-dark'}
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
      /> */}
      <Editor
        width={width}
        height={height}
        language={language}
        value={language === 'javascript' ? undefined : editorText}
        theme={theme === 'normal' ? 'custome-theme' : 'vs-dark'}
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
        beforeMount={onBeforeMount}
      />
    </div>
  );
});
