'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { token } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus],
    queryFn: async () => {
      let url = '/api/admin/orders';
      if (selectedStatus !== 'all') url += `?orderStatus=${selectedStatus}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      return json.data?.orders || json.data || [];
    },
    enabled: !!token,
  });

  const statuses = ['all', 'pending_payment', 'paid', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 mb-2 inline-block">← Dashboard</Link>
      <h1 className="text-3xl font-semibold mb-2">Manage Orders</h1>
      <p className="text-slate-500 mb-6">{orders.length} orders</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button key={s} type="button" onClick={() => setSelectedStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${selectedStatus === s ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>
      {isLoading ? <p>Loading…</p> : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No orders found</td></tr>
              ) : (
                orders.map((order: { id: string; orderNumber?: string; customerEmail?: string; totalAmount: string; orderStatus: string }) => (
                  <tr key={order.id} className="border-b border-slate-100">
                    <td className="p-4 font-mono">#{order.orderNumber || order.id.slice(0, 8)}</td>
                    <td className="p-4">{order.customerEmail || '—'}</td>
                    <td className="p-4">{formatPrice(order.totalAmount)}</td>
                    <td className="p-4 capitalize text-xs">{order.orderStatus?.replace('_', ' ')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
