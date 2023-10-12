import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enUS from './langs/en-US';
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
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      'zh-CN': { translation: zhCN },
      'en-US': { translation: enUS },
    },
  });

export const LangList = [
  {
    key: 'zh-CN',
    label: '简体中文',
  },
  {
    key: 'en-US',
    label: 'English',
  },
];

export default i18n;
