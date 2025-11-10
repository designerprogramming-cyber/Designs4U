
import React from 'react';
import { useApp } from '../App';
import type { Product, Order, ProductVariant } from '../types';

interface CheckoutScreenProps {
  product: Product;
  selectedVariant: ProductVariant;
  onPlaceOrder: (order: Order) => void;
  onBack: () => void;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ product, selectedVariant, onPlaceOrder, onBack }) => {
  const { t } = useApp();
  
  const handlePaymentMethodSelect = (method: 'bank' | 'wallet') => {
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      product,
      selectedVariant,
      paymentMethod: method,
      status: 'pending_payment',
    };
    onPlaceOrder(newOrder);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-6">
         <div>
          <button onClick={onBack} className="text-sm font-medium text-primary hover:underline mb-4">
             &larr; {t('productDetailsTitle')}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checkoutTitle')}</h1>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
            <h2 className="font-semibold mb-2">{t('orderSummary')}</h2>
            <div className="flex justify-between items-center">
                <div>
                    <p>{product.name}</p>
                    <p className="text-sm text-gray-500">{selectedVariant.name}</p>
                </div>
                <p className="font-bold">${selectedVariant.price}</p>
            </div>
        </div>

        <div>
            <h2 className="font-semibold mb-4">{t('paymentMethod')}</h2>
            <div className="space-y-4">
                 <button onClick={() => handlePaymentMethodSelect('bank')} className="w-full text-start p-4 border rounded-lg hover:bg-gray-50 flex items-center space-x-3 rtl:space-x-reverse">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                    <span>{t('payWithBank')}</span>
                </button>
                <button onClick={() => handlePaymentMethodSelect('wallet')} className="w-full text-start p-4 border rounded-lg hover:bg-gray-50 flex items-center space-x-3 rtl:space-x-reverse">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2H4z" clipRule="evenodd"></path></svg>
                    <span>{t('payWithWallet')}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;