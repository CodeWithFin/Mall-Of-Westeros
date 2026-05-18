'use client';

import { useQuery } from '@tanstack/react-query';
import Title from './Title';
import ProductCard, { Product } from './ProductCard';

export default function BestSelling() {
  const limit = 8;

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'best-selling', limit],
    queryFn: async () => {
      const res = await fetch(`/api/products?limit=50&sort=newest`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      const all: Product[] = json?.data?.products ?? [];
      const featured = all.filter((p) => p.isFeatured);
      const list = (featured.length >= limit ? featured : all).slice(0, limit);
      return { products: list, total: json?.data?.pagination?.total ?? all.length };
    },
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="px-6 my-20 max-w-6xl mx-auto">
      <Title
        title="Best Selling"
        description={`Showing ${products.length} of ${total} products`}
        href="/products"
      />
      {isLoading ? (
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-slate-100 h-52 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
