
export type Locale = 'en' | 'ar';

export interface Country {
  name: string;
  dial_code: string;
  code: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export interface User {
    email: string;
    role: 'admin' | 'customer';
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  downloadUrl: string; // Will store a data URL for local files
  fileName?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string; // Will store a data URL for local files
  variants: ProductVariant[];
}

export type PaymentMethod = 'bank' | 'wallet';
export type OrderStatus = 'pending_payment' | 'pending_approval' | 'completed' | 'failed';

export interface Order {
  id: string;
  product: Product;
  selectedVariant: ProductVariant;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  screenshot?: string; // Base64 string of the image
}

export interface ChatMessage {
  role: 'user' | 'bot' | 'system';
  text?: string;
  imageUrl?: string;
  isLoading?: boolean;
}