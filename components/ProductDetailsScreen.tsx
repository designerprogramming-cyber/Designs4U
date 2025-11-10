
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import type { Product, ProductVariant } from '../types';

interface ProductDetailsScreenProps {
  product: Product;
  onBuyNow: (variant: ProductVariant) => void;
  onBack: () => void;
}

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ product, onBuyNow, onBack }) => {
  const { t } = useApp();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleBuyNow = () => {
    if (selectedVariant) {
      onBuyNow(selectedVariant);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4">
        <div>
          <button onClick={onBack} className="text-sm font-medium text-primary hover:underline mb-4">
             &larr; {t('backToProducts')}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
        </div>
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg"/>
        <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
        
        {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
                <label htmlFor="variant-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('selectFormat')}</label>
                <select 
                    id="variant-select" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={selectedVariant?.id}
                    onChange={(e) => {
                        const variant = product.variants.find(v => v.id === e.target.value);
                        if(variant) setSelectedVariant(variant);
                    }}
                >
                    {product.variants.map(variant => (
                        <option key={variant.id} value={variant.id}>
                            {variant.name} - ${variant.price}
                        </option>
                    ))}
                </select>
            </div>
        )}

        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('priceLabel')}: ${selectedVariant?.price || 0}
        </p>
        
        <button
          onClick={handleBuyNow}
          disabled={!selectedVariant}
          className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
        >
          {t('buyNowButton')}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsScreen;