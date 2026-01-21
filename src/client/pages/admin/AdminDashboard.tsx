import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  // Stats will be fetched from API
  const stats = [
    { label: 'Total Products', value: '0', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'bg-green-100 text-green-600' },
    { label: 'Total Users', value: '0', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Revenue', value: 'KES 0', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
  ];

  // Recent orders will be fetched from API
  const recentOrders: any[] = [];

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl md:text-6xl">ADMIN DASHBOARD</h1>
          <div className="flex gap-2">
            <Link to="/admin/products" className="px-4 py-2 border-2 border-ink rounded-lg hover:bg-ink hover:text-acid transition-colors">Products</Link>
            <Link to="/admin/orders" className="px-4 py-2 border-2 border-ink rounded-lg hover:bg-ink hover:text-acid transition-colors">Orders</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-paper border-2 border-ink rounded-xl p-6 shadow-hard">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="font-display text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-ink/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-paper border-2 border-ink rounded-xl p-6 shadow-hard">
          <h2 className="font-display text-2xl mb-6">RECENT ORDERS</h2>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-ink/60">
              <ShoppingBag size={48} className="mx-auto mb-3 opacity-40" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-stone/30 rounded-lg">
                <div>
                  <div className="font-mono font-semibold">#{order.id}</div>
                  <div className="text-sm text-ink/60">{order.customer} • {order.product}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg">KES {parseInt(order.amount).toLocaleString()}</div>
                  <span className={`text-xs px-2 py-1 rounded border-2 border-ink ${order.status === 'paid' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}