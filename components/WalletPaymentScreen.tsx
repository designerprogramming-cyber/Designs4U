
import React, { useState } from 'react';
import { useApp } from '../App';
import type { Order } from '../types';

interface WalletPaymentScreenProps {
  order: Order;
  onSubmit: (screenshot: string) => void;
}

const WalletPaymentScreen: React.FC<WalletPaymentScreenProps> = ({ order, onSubmit }) => {
  const { t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preview) {
      onSubmit(preview);
    } else {
      alert('Please upload a screenshot');
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
          {t('walletPaymentTitle')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('walletPaymentInstructions')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="screenshot-upload" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('uploadScreenshot')}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="screenshot-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="screenshot-upload" name="screenshot-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
             {file && <p className="mt-2 text-sm text-gray-500">{t('fileSelected')} {file.name}</p>}
          </div>

          <button type="submit" disabled={!file} className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">
            {t('submitForApproval')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletPaymentScreen;
