'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { FLAT_SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import type { CartItem } from '@/lib/contexts/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  checkout?: boolean;
}

export default function OrderSummary({ items, totalPrice, checkout = false }: OrderSummaryProps) {
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const total = totalPrice + shipping;

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Order Summary</h2>
      <p className="text-slate-400 text-xs my-4">{items.length} item(s) in cart</p>
      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-slate-400">
            <p>Subtotal:</p>
            <p>Shipping:</p>
          </div>
          <div className="flex flex-col gap-1 font-medium text-right">
            <p>{formatPrice(totalPrice)}</p>
            <p>{shipping === 0 ? 'Free' : formatPrice(shipping)}</p>
          </div>
        </div>
        {totalPrice < FREE_SHIPPING_THRESHOLD && (
          <p className="text-xs text-green-600 mt-3">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} more for free shipping
          </p>
        )}
      </div>
      <div className="flex justify-between py-4">
        <p>Total:</p>
        <p className="font-medium text-right text-slate-800">{formatPrice(total)}</p>
      </div>
      {checkout ? (
        <button
          type="submit"
          form="checkout-form"
          className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 transition"
        >
          Complete Order
        </button>
      ) : (
        <Link
          href="/checkout"
          className="block w-full text-center bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 transition"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
