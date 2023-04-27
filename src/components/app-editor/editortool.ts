import * as turf from '@turf/turf';
import _ from 'lodash';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

export function provideCompletionItems(
  model: any,
  position: any,
  type: 'lodash' | 'turf',
) {
  const wordUntilPosition = model.getWordUntilPosition(position);
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: wordUntilPosition.startColumn,
    endColumn: wordUntilPosition.endColumn,
  };
  let suggestions: any[] = [];
  if (type === 'turf') {
    // eslint-disable-next-line guard-for-in
    for (const key in turf) {
      const completionItem = {
        label: key,
        kind: monacoEditor.languages.CompletionItemKind.Function,
        documentation: (turf as any)[key].toString(),
        insertText: key,
        range: range,
      };
      suggestions.push(completionItem);
    }
  } else {
    suggestions = _.chain(_)
      .keys()
      .map((key) => {
        return {
          label: key,
          kind: monacoEditor.languages.CompletionItemKind.Function,
          insertText: key,
          range: range,
        };
      })
      .value();
  }

  return {
    suggestions: suggestions,
  };
}
