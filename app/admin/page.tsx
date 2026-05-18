'use client';

import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load dashboard');
      const json = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  const stats = [
    { label: 'Total Products', value: data?.totalProducts ?? '—', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Orders', value: data?.totalOrders ?? '—', icon: ShoppingBag, color: 'bg-green-100 text-green-600' },
    { label: 'Revenue', value: data ? formatPrice(data.totalRevenue) : '—', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-slate-800">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/products" className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-white">Products</Link>
          <Link href="/admin/orders" className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-white">Orders</Link>
        </div>
      </div>
      {isLoading ? (
        <p className="text-slate-500">Loading dashboard…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className={`inline-flex p-3 rounded-lg mb-4 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <p className="text-3xl font-semibold mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <p className="text-slate-500 text-sm">View and manage orders in the Orders section.</p>
      </div>
    </div>
  );
}
