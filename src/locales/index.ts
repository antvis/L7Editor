import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import zhCN from './langs/zh-CN';

i18n
  // 检测用户当前使用的语言
  // 文档: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // 注入 react-i18next 实例
  .use(initReactI18next)
  // 初始化 i18next
  // 配置参数的文档: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      'zh-CN': { translation: zhCN },
    },
  });

// function flatten(obj) {
//   const ans = {};
//   inner(obj, null);
//   function inner(o, prev) {
//     for (let key in o) {
//       if (o[key] instanceof Object) {
//         if (prev === null) {
//           inner(o[key], key);
//         } else {
//           inner(o[key], prev + '.' + key);
//         }
//       } else {
//         if (prev === null) {
//           ans[key] = o[key];
//         } else {
//           ans[prev + '.' + key] = o[key];
//         }
//       }
//     }
//   }
//   return ans;
// }

// const data = Object.keys(flatten(zhCN)).map((item) => {
//   return {
//     'key': item,
//     'zh-CN': a[item],
//     'en-US': '',
//   };
// });

export default i18n;
