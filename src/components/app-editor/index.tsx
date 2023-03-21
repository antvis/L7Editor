import { useSize } from 'ahooks';
import { editor } from 'monaco-editor';
import React, { useEffect, useMemo, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useModel } from 'umi';
import './index.less';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { prettierText } from '@/utils/prettier-text';
import _ from 'lodash';
import * as turf from '@turf/turf';
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

  // lodash 代码提示补全
  monacoEditor.languages.registerCompletionItemProvider(language, {
    provideCompletionItems: (model, position) =>
      provideCompletionItems(model, position, 'lodash'),
  });

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

  return (
    <div ref={setContainer} className="app-editor">
      <MonacoEditor
        width={width}
        height={height}
        language={language}
        {...value}
        onChange={monacoChange}
        options={{
          selectOnLineNumbers: true,
          tabIndex: 2,
          tabSize: 2,
          folding: true,
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
