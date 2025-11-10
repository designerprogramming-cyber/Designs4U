
import React, { useState } from 'react';
import { useApp } from '../../App';
import type { Product, Category } from '../../types';
import ProductFormModal from './ProductFormModal';

interface ManageProductsProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ManageProducts: React.FC<ManageProductsProps> = ({ products, categories, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const { t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };
  
  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
        onUpdateProduct(productData);
    } else {
        onAddProduct(productData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('deleteConfirmation'))) {
        onDeleteProduct(id);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };
  
  const getPriceRange = (product: Product) => {
      if (!product.variants || product.variants.length === 0) return 'N/A';
      if (product.variants.length === 1) return `$${product.variants[0].price}`;
      const prices = product.variants.map(v => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return `$${min} - $${max}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-end">
        <button
          onClick={() => handleOpenModal()}
          className="text-white bg-primary hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          {t('addProduct')}
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('productName')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('category')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('priceLabel')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map(product => (
                    <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getCategoryName(product.categoryId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getPriceRange(product)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <button onClick={() => handleOpenModal(product)} className="text-primary hover:text-primary-800">{t('editProduct')}</button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">{t('delete')}</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageProducts;