
import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import type { Order } from '../types';

interface OrderConfirmationScreenProps {
  order: Order;
  setOrder: (order: Order) => void;
  onBackToProducts: () => void;
}

const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({ order, setOrder, onBackToProducts }) => {
  const { t } = useApp();
  const [isApproving, setIsApproving] = useState(order.status === 'pending_approval');

  useEffect(() => {
    if (order.status === 'pending_approval') {
      const timer = setTimeout(() => {
        setOrder({ ...order, status: 'completed' });
        setIsApproving(false);
      }, 5000); // Simulate 5 second approval time
      return () => clearTimeout(timer);
    }
  }, [order, setOrder]);
  
  const getStatusPill = (status: string) => {
      const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
      switch(status) {
          case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
          case 'pending_approval': return `${baseClasses} bg-yellow-100 text-yellow-800`;
          default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-6 text-center">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
          {t('orderConfirmationTitle')}
        </h1>

        <div className="p-4 border border-gray-200 rounded-lg text-start space-y-2">
            <div className="flex justify-between items-start">
                <div>
                    <p>{order.product.name}</p>
                    <p className="text-sm text-gray-500">{order.selectedVariant.name}</p>
                </div>
                <span className="font-bold">${order.selectedVariant.price}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">{t('orderStatusLabel')}</span>
                <span className={getStatusPill(order.status)}>
                    {t(`status_${order.status}`)}
                </span>
            </div>
        </div>

        {order.status === 'completed' && (
             <div className="space-y-4">
                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <a href={order.selectedVariant.downloadUrl} download={order.selectedVariant.fileName || 'download'} className="block w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {t('downloadFileButton')}
                </a>
             </div>
        )}
        
        {isApproving && (
            <div className="space-y-4">
                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                    <svg className="animate-spin h-10 w-10 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('pendingApprovalMessage')}
                </p>
            </div>
        )}

        <button onClick={onBackToProducts} className="w-full text-primary bg-transparent border border-primary hover:bg-primary-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            {t('backToProducts')}
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationScreen;