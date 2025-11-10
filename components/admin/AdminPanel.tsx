
import React, { useState } from 'react';
import { useApp } from '../../App';
import type { Product, Category } from '../../types';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBack: () => void;
}

type AdminTab = 'products' | 'categories';

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const getTabClass = (tabName: AdminTab) => {
    return `px-4 py-2 text-sm font-medium rounded-lg ${
      activeTab === tabName
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
            {t('adminPanel')}
          </h1>
          <button onClick={props.onBack} className="text-sm font-medium text-primary hover:underline">
            &larr; {t('backToProducts')}
          </button>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('products')}
              className={getTabClass('products')}
            >
              {t('manageProducts')}
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={getTabClass('categories')}
            >
              {t('manageCategories')}
            </button>
          </div>
        </div>

        <div>
          {activeTab === 'products' && (
            <ManageProducts
              products={props.products}
              categories={props.categories}
              onAddProduct={props.onAddProduct}
              onUpdateProduct={props.onUpdateProduct}
              onDeleteProduct={props.onDeleteProduct}
            />
          )}
          {activeTab === 'categories' && (
            <ManageCategories
              categories={props.categories}
              onAddCategory={props.onAddCategory}
              onDeleteCategory={props.onDeleteCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
