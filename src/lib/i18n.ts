import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from '../locales/ru.json';
import en from '../locales/en.json';

// Get saved language from localStorage or default to Russian
const savedLanguage = localStorage.getItem('i18nextLng') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ru,
      },
      en: {
        translation: en,
      },
    },
    lng: savedLanguage, // Use saved language or default to Russian
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Save language preference to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
