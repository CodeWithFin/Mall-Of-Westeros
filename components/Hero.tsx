'use client';

import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CategoriesMarquee from './CategoriesMarquee';
import { formatPrice } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

export default function Hero() {
  return (
    <div className="mx-6">
      <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10">
        <div className="relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-100 group">
          <div className="p-5 sm:p-16">
            <div className="inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm">
              <span className="bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs">NEW</span>
              Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}!
              <ChevronRightIcon className="group-hover:ml-2 transition-all" size={16} />
            </div>
            <h2 className="text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs sm:max-w-md">
              Premium tech for Westeros
            </h2>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-md">
              Phones, laptops, and accessories — authentic products, competitive KES prices.
            </p>
            <div className="text-slate-800 text-sm font-medium mt-4 sm:mt-8">
              <p>Shop premium devices</p>
              <p className="text-3xl">From {formatPrice(49900)}</p>
            </div>
            <Link
              href="/products"
              className="inline-block bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 transition"
            >
              SHOP NOW
            </Link>
          </div>
          <Image
            className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm"
            src="/assets/hero_model_img.png"
            alt="Premium tech"
            width={400}
            height={500}
            priority
          />
        </div>
        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600">
          <Link
            href="/products?category=phone"
            className="flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group"
          >
            <div>
              <p className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40">
                Best phones
              </p>
              <p className="flex items-center gap-1 mt-4">
                View more <ArrowRightIcon className="group-hover:ml-2 transition-all" size={18} />
              </p>
            </div>
            <Image className="w-35" src="/assets/hero_product_img1.png" alt="Phones" width={120} height={120} />
          </Link>
          <Link
            href="/products?category=laptop"
            className="flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group"
          >
            <div>
              <p className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40">
                Top laptops
              </p>
              <p className="flex items-center gap-1 mt-4">
                View more <ArrowRightIcon className="group-hover:ml-2 transition-all" size={18} />
              </p>
            </div>
            <Image className="w-35" src="/assets/hero_product_img2.png" alt="Laptops" width={120} height={120} />
          </Link>
        </div>
      </div>
      <CategoriesMarquee />
    </div>
  );
}
