
import React, { useState } from 'react';
import { useApp } from '../App';
import PhoneNumberInput from './common/PhoneNumberInput';

interface ForgotPasswordScreenProps {
  onSendCode: (phone: string) => void;
  navigateToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onSendCode, navigateToLogin }) => {
  const { t } = useApp();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSendCode(phone);
    }, 1500);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          {t('forgotPasswordTitle')}
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          {t('forgotPasswordSubtitle')}
        </p>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('phoneLabel')}</label>
            <PhoneNumberInput value={phone} onChange={setPhone} />
          </div>
          <button type="submit" disabled={isLoading} className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50">
            {isLoading ? t('processing') : t('sendResetCode')}
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToLogin(); }} className="font-medium text-primary hover:underline">&larr; {t('signInLink')}</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;