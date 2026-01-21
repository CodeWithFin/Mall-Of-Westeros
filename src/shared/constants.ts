export const APP_NAME = 'Mall of Westeros';
export const APP_DESCRIPTION = 'Premium Phones & Laptops for Westeros';

// API
export const API_BASE_URL = '/api';
export const API_VERSION = 'v1';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Shipping
export const FLAT_SHIPPING_COST = 500; // KSH
export const FREE_SHIPPING_THRESHOLD = 50000; // KSH

// Product
export const MAX_PRODUCT_IMAGES = 5;
export const MIN_PRODUCT_IMAGES = 1;

// Password
export const MIN_PASSWORD_LENGTH = 8;
export const BCRYPT_SALT_ROUNDS = 10;

// JWT
export const JWT_COOKIE_NAME = 'auth_token';
export const JWT_REFRESH_COOKIE_NAME = 'refresh_token';

// Rate Limiting
export const AUTH_RATE_LIMIT = {
  max: 5,
  timeWindow: '15 minutes',
};

// Order
export const ORDER_NUMBER_PREFIX = 'MOW';

// Product Categories
export const PRODUCT_CATEGORIES = {
  phone: 'Phones',
  laptop: 'Laptops',
} as const;

// Product Brands (examples)
export const PHONE_BRANDS = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'Realme'];
export const LAPTOP_BRANDS = ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Razer', 'Microsoft'];

// Order Status Colors (for UI)
export const ORDER_STATUS_COLORS = {
  pending_payment: 'yellow',
  paid: 'blue',
  processing: 'purple',
  shipped: 'indigo',
  delivered: 'green',
  cancelled: 'red',
} as const;

// Payment Status Colors (for UI)
export const PAYMENT_STATUS_COLORS = {
  pending: 'yellow',
  paid: 'green',
  failed: 'red',
  refunded: 'gray',
} as const;
