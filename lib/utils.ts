export function formatPrice(price: string | number) {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(value);
}

export function getProductImage(images: string | string[], index = 0) {
  if (Array.isArray(images)) return images[index] || '';
  return images || '';
}
