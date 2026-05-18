'use client';

import ProductCard, { Product } from '@/components/ProductCard';
import { useCart } from '@/lib/contexts/CartContext';
import { formatPrice, getProductImage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRight,
  Cpu,
  FileText,
  Lock,
  Maximize2,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/slug/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
    enabled: !!slug,
  });

  const product = response?.data;

  const { data: relatedResponse } = useQuery({
    queryKey: ['products', 'related', product?.category],
    queryFn: async () => {
      const res = await fetch(`/api/products?category=${product.category}&limit=4`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!product?.category,
  });

  const relatedProducts: Product[] =
    relatedResponse?.data?.products?.filter((p: Product) => p.id !== product?.id).slice(0, 4) || [];

  const specs = useMemo(() => {
    if (!product?.specifications) return {};
    return typeof product.specifications === 'string'
      ? JSON.parse(product.specifications)
      : product.specifications;
  }, [product]);

  const images: string[] = useMemo(() => {
    if (!product) return [];
    return Array.isArray(product.images) ? product.images : [product.images];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product as unknown as Record<string, unknown>, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="mx-6 py-10 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 bg-slate-100 rounded w-1/3 mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-100 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-6 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-6 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-green-600 hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-6 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-800">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-slate-800">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/products?category=${product.category}`} className="capitalize hover:text-slate-800">
            {product.category}s
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="relative bg-[#F5F5F5] border border-slate-200 rounded-3xl overflow-hidden aspect-square group mb-6">
              {product.isFeatured && (
                <div className="absolute top-4 left-4 z-10 bg-green-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Featured
                </div>
              )}
              <Image
                src={images[selectedImage] || getProductImage(product.images) || '/assets/upload_area.svg'}
                alt={product.name}
                fill
                className="object-contain p-6 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-4 right-4">
                <button type="button" className="bg-white p-3 rounded-full border border-slate-200 shadow-sm">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-xl border overflow-hidden bg-white ${
                      selectedImage === idx ? 'border-green-500' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{product.brand}</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800 mt-1">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
                {product.stockQuantity > 0 ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">In Stock</span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-green-600 mb-2">
                <Cpu size={14} /> Key Features
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {product.stockQuantity > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 font-bold">−</button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="px-4 font-bold">+</button>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                      addedToCart ? 'bg-green-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    {addedToCart ? '✓ Added!' : 'Add to Cart'} <ShoppingCart size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 text-center">
                  <div className="flex items-center justify-center gap-1"><Shield size={14} /> Authentic</div>
                  <div className="flex items-center justify-center gap-1"><Truck size={14} /> Fast Ship</div>
                  <div className="flex items-center justify-center gap-1"><Lock size={14} /> Secure</div>
                </div>
              </div>
            )}

            <details className="bg-white border border-slate-200 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer flex items-center gap-2">
                <Package size={18} /> What&apos;s In The Box
              </summary>
              <ul className="mt-3 text-sm text-slate-600 space-y-1 list-disc pl-5">
                <li>1× {product.name}</li>
                <li>Charging cable & documentation</li>
              </ul>
            </details>
            <details className="bg-white border border-slate-200 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer flex items-center gap-2">
                <FileText size={18} /> Full Description
              </summary>
              <p className="mt-3 text-sm text-slate-600">{product.description}</p>
            </details>
            <details className="bg-white border border-slate-200 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer flex items-center gap-2">
                <Cpu size={18} /> Specifications
              </summary>
              <div className="mt-3 space-y-2 text-sm">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-slate-100 py-1">
                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-semibold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
