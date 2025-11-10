
import React, { useState, useEffect, createContext, useContext } from 'react';
import type { Locale, Product, Order, Category, User, ProductVariant } from './types';
import { translations } from './constants/translations';
import { PRODUCTS as initialProducts } from './constants/products';
import { CATEGORIES as initialCategories } from './constants/categories';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import EmailVerificationScreen from './components/EmailVerificationScreen';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import ProductsScreen from './components/ProductsScreen';
import ProductDetailsScreen from './components/ProductDetailsScreen';
import CheckoutScreen from './components/CheckoutScreen';
import BankPaymentScreen from './components/BankPaymentScreen';
import WalletPaymentScreen from './components/WalletPaymentScreen';
import OrderConfirmationScreen from './components/OrderConfirmationScreen';
import AdminPanel from './components/admin/AdminPanel';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import PasswordResetScreen from './components/PasswordResetScreen';
import FloatingChatButton from './components/FloatingChatButton';
import ChatbotModal from './components/ChatbotModal';

type Page = 'login' | 'register' | 'verify' | 'products' | 'productDetails' | 'checkout' | 'bankPayment' | 'walletPayment' | 'orderConfirmation' | 'adminPanel' | 'forgotPassword' | 'resetPassword';

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('register');
  const [locale, setLocale] = useState<Locale>('en');
  const [user, setUser] = useState<User | null>(null);
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [resetPhoneNumber, setResetPhoneNumber] = useState<string>('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);
  
  const t = (key: string, replacements: { [key: string]: string } = {}): string => {
    let translation = translations[locale][key] || key;
    Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    return translation;
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setPage('products');
  };
  const handleRegisterSuccess = (email: string) => {
    setUser({ email, role: 'customer' });
    setPage('verify');
  };
  const handleLogout = () => {
    setUser(null);
    setSelectedProduct(null);
    setCurrentOrder(null);
    setPage('login');
  };
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setPage('productDetails');
  };

  const handleInitiateCheckout = (variant: ProductVariant) => {
    if (selectedProduct) {
      setSelectedVariant(variant);
      setPage('checkout');
    }
  };

  const handlePlaceOrder = (order: Order) => {
    setCurrentOrder(order);
    if (order.paymentMethod === 'bank') {
      setPage('bankPayment');
    } else {
      setPage('walletPayment');
    }
  };

  const handlePaymentComplete = () => {
      if(currentOrder) {
          setCurrentOrder({...currentOrder, status: 'completed'});
          setPage('orderConfirmation');
      }
  };

  const handleWalletSubmission = (screenshot: string) => {
      if(currentOrder) {
          setCurrentOrder({...currentOrder, status: 'pending_approval', screenshot});
          setPage('orderConfirmation');
      }
  };

  const handleSendResetCode = (phone: string) => {
    setResetPhoneNumber(phone);
    // In a real app, you would send a code here.
    // For simulation, we'll just move to the next screen.
    alert(`A verification code has been sent to ${phone}. For this demo, use code 123456.`);
    setPage('resetPassword');
  };

  const handlePasswordResetSuccess = () => {
    setLoginMessage(t('passwordResetSuccess'));
    setPage('login');
    setResetPhoneNumber('');
  };
  
  // Admin Panel Handlers
  const handleAddCategory = (name: string) => {
    const newCategory: Category = { id: `cat_${Date.now()}`, name };
    setCategories([...categories, newCategory]);
  };
  
  const handleDeleteCategory = (id: string) => {
    setProducts(products.filter(p => p.categoryId !== id));
    setCategories(categories.filter(c => c.id !== id));
  };
  
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: `prod_${Date.now()}` };
    setProducts([...products, newProduct]);
  };
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };


  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleAuthSuccess} navigateToRegister={() => setPage('register')} navigateToForgotPassword={() => setPage('forgotPassword')} message={loginMessage} clearMessage={() => setLoginMessage(null)} />;
      case 'register':
        return <RegisterScreen onRegisterSuccess={handleRegisterSuccess} navigateToLogin={() => setPage('login')} />;
      case 'verify':
        return <EmailVerificationScreen onVerificationSuccess={() => setPage('products')} userEmail={user?.email || ''} />;
      case 'forgotPassword':
        return <ForgotPasswordScreen onSendCode={handleSendResetCode} navigateToLogin={() => setPage('login')} />;
      case 'resetPassword':
        return <PasswordResetScreen onResetSuccess={handlePasswordResetSuccess} phoneNumber={resetPhoneNumber} />;
      case 'products':
        return user ? <ProductsScreen user={user} products={products} categories={categories} onSelectProduct={handleSelectProduct} onLogout={handleLogout} onNavigateToAdmin={() => setPage('adminPanel')} /> : null;
      case 'productDetails':
        return selectedProduct ? <ProductDetailsScreen product={selectedProduct} onBuyNow={handleInitiateCheckout} onBack={() => setPage('products')} /> : <p>Product not found</p>;
      case 'checkout':
        return selectedProduct && selectedVariant ? <CheckoutScreen product={selectedProduct} selectedVariant={selectedVariant} onPlaceOrder={handlePlaceOrder} onBack={() => setPage('productDetails')} /> : <p>Product not found</p>;
      case 'bankPayment':
        return <BankPaymentScreen onPaymentSuccess={handlePaymentComplete} />;
      case 'walletPayment':
        return currentOrder ? <WalletPaymentScreen order={currentOrder} onSubmit={handleWalletSubmission} /> : <p>Order not found</p>;
      case 'orderConfirmation':
        return currentOrder ? <OrderConfirmationScreen order={currentOrder} setOrder={setCurrentOrder} onBackToProducts={() => { setPage('products'); setCurrentOrder(null); setSelectedProduct(null); setSelectedVariant(null); }} /> : <p>Order not found</p>;
      case 'adminPanel':
        return <AdminPanel 
                    products={products} 
                    categories={categories}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onBack={() => setPage('products')} 
                />;
      default:
        return <LoginScreen onLoginSuccess={handleAuthSuccess} navigateToRegister={() => setPage('register')} navigateToForgotPassword={() => setPage('forgotPassword')} message={loginMessage} clearMessage={() => setLoginMessage(null)} />;
    }
  };

  const containerClass = page === 'adminPanel' ? "w-full max-w-4xl p-4" : "w-full max-w-md p-4";
  const showChatbot = page === 'products' || page === 'productDetails';

  return (
    <AppContext.Provider value={{ locale, setLocale, t }}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center font-sans">
        <div className="absolute top-4 end-4 z-20">
          <LanguageSwitcher />
        </div>
        <div className={page === 'products' ? 'w-full max-w-6xl p-4' : containerClass}>
          {renderPage()}
        </div>
        {showChatbot && <FloatingChatButton onClick={() => setIsChatbotOpen(true)} />}
        {isChatbotOpen && <ChatbotModal onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </AppContext.Provider>
  );
};

export default App;