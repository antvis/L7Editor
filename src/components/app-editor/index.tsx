import { useSize } from 'ahooks';
import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useModel } from 'umi';
import './index.less';

export const AppEditor: React.FC = React.memo(() => {
  const { editorText, setEditorText } = useModel('feature');
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};

  return (
    <div ref={setContainer} className="app-editor">
      <MonacoEditor
        width={width}
        height={height}
        language="json"
        value={editorText}
        onChange={setEditorText}
        options={{
          selectOnLineNumbers: true,
          tabIndex: 2,
          tabSize: 2,
          folding: true,
          foldingStrategy: 'indentation',
          scrollBeyondLastLine: false,
          foldingMaximumRegions: Number.MAX_SAFE_INTEGER,
        }}
      />
    </div>
  );
});
