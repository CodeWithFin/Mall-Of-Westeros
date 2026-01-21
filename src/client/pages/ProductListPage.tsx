import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import ProductCard from '../components/ProductCard';
import { Smartphone, Laptop, SlidersHorizontal } from 'lucide-react';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: response, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, selectedBrand, sortBy],
    queryFn: async () => {
      let url = '/api/products?';
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (selectedBrand !== 'all') url += `brand=${selectedBrand}&`;
      url += `sort=${sortBy}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const products = response?.data?.products || [];
  const brands = Array.from(new Set(products?.map((p: any) => p.brand) || []));

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams(category !== 'all' ? { category } : {});
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-6xl mb-4">
            {selectedCategory === 'phone' ? 'PHONES' : selectedCategory === 'laptop' ? 'LAPTOPS' : 'ALL PRODUCTS'}
          </h1>
          <p className="text-ink/60 text-lg">
            {products?.length || 0} products available
          </p>
        </div>

        {/* Filters */}
        <div className="bg-stone/50 border-2 border-ink rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={20} />
            <span className="font-display text-lg">FILTERS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 border-ink font-semibold transition-colors ${
                    selectedCategory === 'all' ? 'bg-ink text-acid' : 'bg-paper hover:bg-stone'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleCategoryChange('phone')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 border-ink font-semibold transition-colors flex items-center justify-center gap-2 ${
                    selectedCategory === 'phone' ? 'bg-ink text-acid' : 'bg-paper hover:bg-stone'
                  }`}
                >
                  <Smartphone size={16} />
                  Phones
                </button>
                <button
                  onClick={() => handleCategoryChange('laptop')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 border-ink font-semibold transition-colors flex items-center justify-center gap-2 ${
                    selectedCategory === 'laptop' ? 'bg-ink text-acid' : 'bg-paper hover:bg-stone'
                  }`}
                >
                  <Laptop size={16} />
                  Laptops
                </button>
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-ink bg-paper font-semibold focus:outline-none focus:ring-2 focus:ring-acid"
              >
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-ink bg-paper font-semibold focus:outline-none focus:ring-2 focus:ring-acid"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-stone/30 border-2 border-ink rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-display text-2xl mb-2">No Products Found</h3>
            <p className="text-ink/60">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}