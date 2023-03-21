import { useSize } from 'ahooks';
import { editor } from 'monaco-editor';
import React, { useMemo, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useModel } from 'umi';
import './index.less';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { prettierText } from '@/utils/prettier-text';
import { provideCompletionItems } from './editortool';

type Language = 'json' | 'javascript';

type EditorProps = {
  language?: Language;
  onChange?: (content: string) => void;
};

export const AppEditor: React.FC<EditorProps> = React.memo((props) => {
  const { language = 'json', onChange } = props;
  const { editorText, setEditorText } = useModel('feature');
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};

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
    }
  })


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

  const monacoChange = (event: string) => {
    if (language === 'json') {
      setEditorText(event);
      return;
    }
    onChange?.(event);
  };

  const value = useMemo(() => {
    if (language === 'javascript') {
      return {};
    }
    return { value: editorText };
  }, [language, editorText]);

  const editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    // 粘贴后事件
    // editor.onDidPaste(() => {
    //   const formatValue = prettierText({ content: editor.getValue(), parser: language })
    //   editor.setValue(formatValue)
    // })
  }

  return (
    <div ref={setContainer} className="app-editor">
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
          mouseStyle:'text',
          foldingStrategy: 'indentation',
          scrollBeyondLastLine: false,
          foldingMaximumRegions: Number.MAX_SAFE_INTEGER,
          suggest: {
            showKeywords: true,
          },
        }}
        editorDidMount={editorDidMount}
      />
    </div>
  );
});
