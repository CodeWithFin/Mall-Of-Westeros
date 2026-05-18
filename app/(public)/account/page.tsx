'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { LogOut, MapPin, Package, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function AccountContent() {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!token,
  });

  return (
    <div className="mx-6 py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">My Account</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.fullName}</p>
        </div>
        <button type="button" onClick={logout} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>
      <div className="flex gap-2 mb-8 border-b border-slate-200">
        {[
          { id: 'orders' as const, label: 'Orders', icon: Package },
          { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
          { id: 'profile' as const, label: 'Profile', icon: User },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px ${activeTab === id ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Package size={48} className="mx-auto mb-3 opacity-40" />
              <p className="mb-4">No orders yet</p>
              <Link href="/products" className="text-green-600 hover:underline">Browse products</Link>
            </div>
          ) : (
            orders.map((order: { id: string; orderNumber: string; totalAmount: string; orderStatus: string; createdAt: string }) => (
              <div key={order.id} className="border border-slate-200 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="font-mono font-semibold">#{order.orderNumber || order.id.slice(0, 8)}</p>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                  <span className="text-xs uppercase text-slate-500">{order.orderStatus?.replace('_', ' ')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === 'addresses' && (
        <div className="text-center py-16 text-slate-500">
          <MapPin size={48} className="mx-auto mb-3 opacity-40" />
          <p>No saved addresses. Add one at checkout.</p>
        </div>
      )}
      {activeTab === 'profile' && (
        <div className="max-w-lg border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" defaultValue={user?.fullName} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
          </div>
          <button type="button" className="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm">Update Profile</button>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}
