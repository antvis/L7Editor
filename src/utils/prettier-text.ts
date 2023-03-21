import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
interface Options {
  /**
   * 要格式化的文本
   */
  content: string | any;
}
export function prettierText(options: Options) {
  const { content } = options;
  let newContent = content;
  if (typeof content !== 'string') {
    newContent = JSON.stringify(content);
  }
  const newText = prettier.format(newContent, {
    parser: 'json',
    plugins: [parserBabel],
  });
  return newText;
}
