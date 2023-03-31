import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
interface Options {
  /**
   * 要格式化的文本
   */
  content: string | any;
  parser?: string;
}
export function prettierText(options: Options) {
  const { content, parser = 'json' } = options;
  let newContent = content;
  if (typeof content !== 'string') {
    newContent = JSON.stringify(content,null,2);
  }

  const newText = prettier.format(newContent, {
    parser: parser === 'json' ? parser : 'babel',
    plugins: [parserBabel]
  });

  return newText;
}
