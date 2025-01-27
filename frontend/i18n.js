import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

// Configure i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar }
  },
  lng: 'fr', // Default language
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
