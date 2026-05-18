'use client';

import OrderSummary from '@/components/OrderSummary';
import PageTitle from '@/components/PageTitle';
import { useCart } from '@/lib/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-600 mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-green-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <PageTitle heading="My Cart" text={`${items.length} items in your cart`} linkText="Add more" path="/products" />
        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <table className="w-full max-w-4xl text-slate-600 table-auto">
            <thead>
              <tr className="max-sm:text-sm border-b border-slate-200">
                <th className="text-left py-3">Product</th>
                <th className="py-3">Quantity</th>
                <th className="py-3">Total</th>
                <th className="max-md:hidden py-3">Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="flex gap-3 my-4">
                    <div className="flex gap-3 items-center bg-slate-100 size-18 rounded-md min-w-[72px] min-h-[72px] relative overflow-hidden">
                      <Image src={item.image || '/assets/upload_area.svg'} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <Link href={`/products/${item.slug}`} className="max-sm:text-sm font-medium hover:text-green-600">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500">{item.brand}</p>
                      <p>{formatPrice(item.price)}</p>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="inline-flex items-center border border-slate-200 rounded-lg">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-slate-100" disabled={item.quantity <= 1}>
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-slate-100" disabled={item.quantity >= item.stockQuantity}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="text-center font-medium">{formatPrice(parseFloat(item.price) * item.quantity)}</td>
                  <td className="text-center max-md:hidden">
                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <OrderSummary items={items} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
}
