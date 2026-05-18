'use client';

import OrderSummary from '@/components/OrderSummary';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';
import { FLAT_SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart();
  const { token, user } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: '',
    email: user?.email || '',
    county: '',
    town: '',
    streetAddress: '',
    apartment: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const syncCartToServer = async () => {
    for (const item of items) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setIsProcessing(true);
    try {
      await syncCartToServer();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress: form, paymentMethod }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Order failed');
      clearCart();
      router.push(`/order-confirmation/${data.data.order.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;

  if (items.length === 0) {
    return (
      <div className="mx-6 py-20 text-center text-slate-500">
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-green-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-8">Checkout</h1>
        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input name="fullName" value={form.fullName} onChange={handleChange} type="text" placeholder="Full Name" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                <input name="county" value={form.county} onChange={handleChange} type="text" placeholder="County" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                <input name="town" value={form.town} onChange={handleChange} type="text" placeholder="Town/City" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                <textarea name="streetAddress" value={form.streetAddress} onChange={handleChange} placeholder="Street Address" className="w-full px-4 py-3 border border-slate-200 rounded-lg" rows={3} required />
                <input name="apartment" value={form.apartment} onChange={handleChange} type="text" placeholder="Apartment/Unit (optional)" className="w-full px-4 py-3 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button type="button" onClick={() => setPaymentMethod('card')} className={`p-4 border rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-slate-800 text-white' : 'bg-white border-slate-200'}`}>
                  <CreditCard size={20} /> Card
                </button>
                <button type="button" onClick={() => setPaymentMethod('mpesa')} className={`p-4 border rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'mpesa' ? 'bg-slate-800 text-white' : 'bg-white border-slate-200'}`}>
                  <Smartphone size={20} /> M-Pesa
                </button>
              </div>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                    <input type="text" placeholder="CVV" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
                  </div>
                </div>
              )}
              {paymentMethod === 'mpesa' && (
                <input type="tel" placeholder="M-Pesa Phone (0712345678)" className="w-full px-4 py-3 border border-slate-200 rounded-lg" required />
              )}
            </div>
          </div>
          <div>
            <OrderSummary items={items} totalPrice={totalPrice} checkout />
            <p className="text-xs text-slate-400 mt-4 text-center">Total: {formatPrice(totalPrice + shipping)}</p>
            <button type="submit" disabled={isProcessing} className="w-full mt-4 bg-slate-800 text-white py-3 rounded-lg disabled:opacity-50 lg:hidden">
              {isProcessing ? 'Processing…' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
