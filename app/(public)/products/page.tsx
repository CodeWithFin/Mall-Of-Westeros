'use client';

import ProductCard, { Product } from '@/components/ProductCard';
import { Smartphone, Laptop, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const apiSort =
    sortBy === 'price-asc' ? 'price_asc' : sortBy === 'price-desc' ? 'price_desc' : sortBy === 'name' ? 'name' : 'newest';

  const { data: response, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, selectedBrand, sortBy, search],
    queryFn: async () => {
      let url = '/api/products?';
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (selectedBrand !== 'all') url += `brand=${encodeURIComponent(selectedBrand)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      url += `sort=${apiSort}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const products: Product[] = response?.data?.products || [];
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category !== 'all') params.set('category', category);
    else params.delete('category');
    router.push(`/products?${params.toString()}`);
  };

  const title =
    selectedCategory === 'phone' ? 'Phones' : selectedCategory === 'laptop' ? 'Laptops' : search ? `Results for "${search}"` : 'All Products';

  return (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2">{title}</h1>
          <p className="text-slate-500">{products.length} products available</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={20} />
            <span className="font-semibold">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'phone', label: 'Phones', icon: Smartphone },
                  { id: 'laptop', label: 'Laptops', icon: Laptop },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleCategoryChange(id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${
                      selectedCategory === id ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200'
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white">
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white">
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-slate-100 h-52 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">📦</p>
            <h3 className="text-xl font-semibold">No Products Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <ProductsContent />
    </Suspense>
  );
}
