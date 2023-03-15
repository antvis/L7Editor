import { useFilterFeature } from '@/hooks/useFilterFeature';
import { useSize } from 'ahooks';
import { isEmpty } from 'lodash';
import React, { useMemo, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useModel } from 'umi';
import './index.less';

export const AppEditor: React.FC = React.memo(() => {
  const { editorText, setEditorText } = useModel('feature');
  const { filter } = useModel('filter');
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { width = 0, height = 0 } = useSize(container) ?? {};
  const { newFeatures } = useFilterFeature()

  const newEditText = useMemo(()=>{
    if (isEmpty(filter)) {
      return editorText
    }
    return JSON.stringify(newFeatures, null, 2)
  },[editorText,filter,newFeatures])
  
  return (
    <div ref={setContainer} className="app-editor">
      <MonacoEditor
        width={width}
        height={height}
        language="json"
        value={newEditText}
        onChange={setEditorText}
        options={{
          selectOnLineNumbers: true,
          tabIndex: 2,
          tabSize: 2,
          folding: true,
          foldingStrategy: 'indentation',
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
});
