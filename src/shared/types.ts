// User types
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

// Product types
export type ProductCategory = 'phone' | 'laptop';

export interface PhoneSpecifications {
  screenSize: string;
  ram: string;
  storage: string;
  camera: string;
  battery: string;
  os: string;
}

export interface LaptopSpecifications {
  processor: string;
  ram: string;
  storage: string;
  screenSize: string;
  graphicsCard: string;
  os: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  model: string;
  description: string;
  specifications: PhoneSpecifications | LaptopSpecifications;
  price: string;
  currency: string;
  stockQuantity: number;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export type PaymentMethod = 'card' | 'mpesa';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  county: string;
  town: string;
  streetAddress: string;
  apartment?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  subtotal: string;
  shippingCost: string;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionReference: string | null;
  orderStatus: OrderStatus;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

// Cart types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  county: string;
  town: string;
  streetAddress: string;
  apartment: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and sort types
export interface ProductFilters {
  category?: ProductCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name';
}

export interface OrderFilters {
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}
