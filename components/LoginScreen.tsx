
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { User } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  navigateToRegister: () => void;
  navigateToForgotPassword: () => void;
  message?: string | null;
  clearMessage: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, navigateToRegister, navigateToForgotPassword, message, clearMessage }) => {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      if(message) {
          const timer = setTimeout(() => {
              clearMessage();
          }, 5000); // Clear message after 5 seconds
          return () => clearTimeout(timer);
      }
  }, [message, clearMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let user: User | null = null;
    
    if (email.toLowerCase() === 'admin' && password === '0') {
      user = { email: 'admin', role: 'admin' };
    } else if (email.toLowerCase() === 'user' && password === '00') {
      user = { email: 'user', role: 'customer' };
    }

    if (user) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user as User);
      }, 1500);
    } else {
      alert(t('invalidCredentials'));
    }
  };

  const LoadingIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        {message && (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            {message}
          </div>
        )}
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          {t('loginTitle')}
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          {t('loginSubtitle')}
        </p>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('emailLabel')}</label>
            <input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
          </div>
          <div>
             <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">{t('passwordLabel')}</label>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateToForgotPassword(); }} className="text-sm font-medium text-primary hover:underline">{t('forgotPassword')}</a>
            </div>
            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex justify-center items-center disabled:opacity-50">
            {isLoading && <LoadingIcon />}
            {isLoading ? t('processing') : t('loginButton')}
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            {t('noAccount')} <a href="#" onClick={(e) => { e.preventDefault(); navigateToRegister(); }} className="font-medium text-primary hover:underline">{t('signUpLink')}</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;