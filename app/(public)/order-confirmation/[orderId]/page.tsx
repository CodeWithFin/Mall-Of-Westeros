'use client';

import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="mx-6 py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 mb-2">Thank you for your purchase</p>
        <p className="font-mono text-lg text-slate-700">Order #{orderId}</p>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">What happens next?</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold shrink-0">1</div>
            <div>
              <h3 className="font-semibold">Order Processing</h3>
              <p className="text-sm text-slate-500">We&apos;re preparing your items for shipment</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0"><Package size={20} /></div>
            <div>
              <h3 className="font-semibold">Quality Check</h3>
              <p className="text-sm text-slate-500">Ensuring everything is perfect</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0"><Truck size={20} /></div>
            <div>
              <h3 className="font-semibold">Shipping</h3>
              <p className="text-sm text-slate-500">Delivery within 2–5 business days</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/account" className="bg-slate-800 text-white px-8 py-3 rounded-lg hover:bg-slate-900">View Orders</Link>
        <Link href="/products" className="border border-slate-200 px-8 py-3 rounded-lg hover:bg-slate-50">Continue Shopping</Link>
      </div>
    </div>
  );
}
