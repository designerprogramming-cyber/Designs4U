
import React, { useState, useRef } from 'react';
import { useApp } from '../App';

interface EmailVerificationScreenProps {
  onVerificationSuccess: () => void;
  userEmail: string;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ onVerificationSuccess, userEmail }) => {
  const { t } = useApp();
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input
      if (value !== '' && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
        alert("Please enter the full 6-digit code.");
        return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onVerificationSuccess();
    }, 1500);
  };
  
  const LoadingIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          {t('verificationTitle')}
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          {t('verificationSubtitle')} <br/>
          <span className="font-medium text-gray-700">{userEmail}</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 md:gap-4 my-8" dir="ltr">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputsRef.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                required
              />
            ))}
          </div>
          <button type="submit" disabled={isLoading} className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center disabled:opacity-50">
             {isLoading && <LoadingIcon />}
             {isLoading ? t('processing') : t('verifyButton')}
          </button>
        </form>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          {t('didNotReceiveCode')} <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-primary hover:underline">{t('resendLink')}</a>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;
