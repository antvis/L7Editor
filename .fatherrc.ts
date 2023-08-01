import { defineConfig } from 'father';

export default defineConfig({
  esm: { output: 'es' },
  cjs: { output: 'lib' },
  // https://github.com/umijs/father/blob/master/docs/config.md#umd
  // umd: {
  //   name: 'L7 Editor',
  //   output: 'dist',
  //   extractCSS: false,
  //   postcssOptions: {},
  //   externals: {
  //   },
  // },
});
