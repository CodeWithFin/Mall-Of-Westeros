export {
  APP_NAME,
  APP_DESCRIPTION,
  FLAT_SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  PRODUCT_CATEGORIES,
} from '@/shared/constants';

export const CURRENCY = 'KES';

// Short single-line labels (matches gocart marquee pill style)
export const MARQUEE_CATEGORIES = [
  'Phones',
  'Laptops',
  'Apple',
  'Samsung',
  'Dell',
  'HP',
  'Lenovo',
  'Asus',
  'MSI',
];

export const ourSpecsData = [
  {
    title: 'Free Shipping',
    description:
      'Enjoy fast delivery across Westeros. Orders above KSH 50,000 ship free.',
    accent: '#05DF72',
  },
  {
    title: '7 Days Easy Return',
    description: 'Change your mind? Return any item within 7 days, hassle-free.',
    accent: '#FF8904',
  },
  {
    title: '24/7 Customer Support',
    description: 'Our team is here to help with orders, products, and delivery.',
    accent: '#A684FF',
  },
] as const;
