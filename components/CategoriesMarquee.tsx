'use client';

import Link from 'next/link';
import { MARQUEE_CATEGORIES } from '@/lib/constants';

const categoryHref = (label: string) => {
  const lower = label.toLowerCase();
  if (lower === 'phones') return '/products?category=phone';
  if (lower === 'laptops') return '/products?category=laptop';
  return `/products?search=${encodeURIComponent(label)}`;
};

export default function CategoriesMarquee() {
  const items = [
    ...MARQUEE_CATEGORIES,
    ...MARQUEE_CATEGORIES,
    ...MARQUEE_CATEGORIES,
    ...MARQUEE_CATEGORIES,
  ];

  return (
    <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
      <div className="flex min-w-[200%] items-center flex-nowrap animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4">
        {items.map((label, index) => (
          <Link
            key={index}
            href={categoryHref(label)}
            className="shrink-0 whitespace-nowrap px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300"
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}
