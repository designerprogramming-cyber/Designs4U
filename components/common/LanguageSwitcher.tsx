
import React from 'react';
import { useApp } from '../../App';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useApp();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {t('language')}
    </button>
  );
};

export default LanguageSwitcher;
