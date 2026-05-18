'use client';

import { StarIcon, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getProductImage } from '@/lib/utils';
import { useCart } from '@/lib/contexts/CartContext';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  brand: string;
  category: string;
  images: string | string[];
  stockQuantity: number;
  isFeatured?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const image = getProductImage(product.images);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQuantity > 0) {
      addToCart(product as unknown as Record<string, unknown>, 1);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group max-xl:mx-auto block">
      <div className="bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center relative">
        {product.isFeatured && (
          <span className="absolute top-2 left-2 text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-medium z-10">
            Featured
          </span>
        )}
        <Image
          width={500}
          height={500}
          className="max-h-30 sm:max-h-40 w-auto group-hover:scale-105 transition duration-300 object-contain"
          src={image || '/assets/upload_area.svg'}
          alt={product.name}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stockQuantity <= 0}
          className="absolute bottom-2 right-2 bg-slate-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-40"
          aria-label="Add to cart"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
      <div className="flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60">
        <div>
          <p className="font-medium line-clamp-2">{product.name}</p>
          <div className="flex mt-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-transparent"
                fill={index < 4 ? '#00C950' : '#D1D5DB'}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 capitalize">{product.brand} · {product.category}</p>
        </div>
        <p className="font-semibold whitespace-nowrap">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
