
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import type { Product, Category, User } from '../types';

interface ProductsScreenProps {
  user: User;
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onLogout: () => void;
  onNavigateToAdmin: () => void;
}

const ProductCard: React.FC<{ product: Product; onSelectProduct: (product: Product) => void; }> = ({ product, onSelectProduct }) => {
    const { t } = useApp();

    const getPriceRange = () => {
        if (!product.variants || product.variants.length === 0) return '$0';
        if (product.variants.length === 1) return `$${product.variants[0].price}`;
        const prices = product.variants.map(v => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return t('priceRange', {min: min.toString(), max: max.toString()});
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-w-3 aspect-h-2 bg-gray-200 sm:aspect-none h-48">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-center sm:h-full sm:w-full" />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectProduct(product); }}>
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {product.name}
                    </a>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.description.substring(0, 60)}...</p>
                <div className="flex flex-1 flex-col justify-end">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{getPriceRange()}</p>
                </div>
            </div>
        </div>
    );
};


const WelcomeBanner: React.FC = () => {
    const { t } = useApp();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="bg-primary-500 rounded-lg shadow-lg p-4 mb-8 text-white text-center transition-all duration-500 ease-out transform scale-100 opacity-100">
            <h2 className="text-2xl font-bold">{t('welcomeBack')}</h2>
            <p className="mt-1">{t('discountCode')}</p>
        </div>
    );
};

const ProductsScreen: React.FC<ProductsScreenProps> = ({ user, products, categories, onSelectProduct, onLogout, onNavigateToAdmin }) => {
  const { t } = useApp();

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('productsTitle')}
          </h1>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {user.role === 'admin' && (
                <button onClick={onNavigateToAdmin} className="text-sm font-medium text-primary hover:underline">
                    {t('adminPanel')}
                </button>
            )}
            <button onClick={onLogout} className="text-sm font-medium text-primary hover:underline">
              {t('logoutButton')}
            </button>
          </div>
        </div>

        <WelcomeBanner />
        
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.categoryId === category.id);
            return (
              <div key={category.id}>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-primary-100">{category.name}</h2>
                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {categoryProducts.map((product) => (
                            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
                        ))}
                    </div>
                ) : (
                  <p className="text-sm text-gray-500">{t('noProductsInCategory')}</p>
                )}
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default ProductsScreen;