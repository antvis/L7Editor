import type { Locale } from 'antd/es/locale';
import antd_en_US from 'antd/lib/locale/en_US';
import antd_zh_cn from 'antd/lib/locale/zh_CN';
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

export const LangList: { lang: string; name: string; antd: Locale }[] = [
  {
    lang: 'zh-CN',
    name: '简体中文',
    antd: antd_zh_cn,
  },
  {
    lang: 'en-US',
    name: 'English',
    antd: antd_en_US,
  },
];

export default i18n;
