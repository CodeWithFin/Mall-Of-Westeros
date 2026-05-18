'use client';

import { useQuery } from '@tanstack/react-query';
import Title from './Title';
import ProductCard, { Product } from './ProductCard';

export default function LatestProducts() {
  const limit = 4;

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'latest', limit],
    queryFn: async () => {
      const res = await fetch(`/api/products?limit=${limit}&sort=newest`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  const products: Product[] = data?.data?.products ?? [];
  const total = data?.data?.pagination?.total ?? products.length;

  return (
    <div className="px-6 my-20 max-w-6xl mx-auto">
      <Title
        title="Latest Products"
        description={`Showing ${Math.min(products.length, limit)} of ${total} products`}
        href="/products"
      />
      {isLoading ? (
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-100 h-52 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
