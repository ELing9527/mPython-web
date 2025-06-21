import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    zh: {
        translation: translationZH
    }
};

i18n
    .use(initReactI18next) // 将 i18n 传递给 react-i18next
    .init({
        resources,
        lng: 'zh', // 默认语言
        fallbackLng: 'zh', // 回退语言
        interpolation: {
            escapeValue: false // React 已经转义了值
        }
    });
