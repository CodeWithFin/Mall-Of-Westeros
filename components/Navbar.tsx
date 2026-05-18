'use client';

import { Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link href="/" className="relative text-4xl font-semibold text-slate-700">
            <span className="text-green-600">mall</span>ow
            <span className="text-green-600 text-5xl leading-0">.</span>
            <p className="absolute text-xs font-semibold -top-1 -right-14 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
              Westeros
            </p>
          </Link>

          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/products?category=phone">Phones</Link>
            <Link href="/products?category=laptop">Laptops</Link>
            <Link href="/products">All Products</Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
              <ShoppingCart size={18} />
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 border border-slate-300 rounded-full hover:bg-slate-50 transition text-sm"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-full hover:bg-slate-50 transition text-sm"
                >
                  <User size={16} />
                  Account
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </Link>
            )}
          </div>

          <div className="sm:hidden flex items-center gap-3">
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className="px-5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
            >
              {isAuthenticated ? 'Account' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
}
