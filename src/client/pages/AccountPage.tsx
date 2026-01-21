import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, User, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Orders will be fetched from API
  const orders: any[] = [];

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-6xl">MY ACCOUNT</h1>
            <p className="text-ink/60 mt-2">Welcome back, {user?.fullName}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-lg hover:bg-ink hover:text-acid transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b-2 border-ink">
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 font-display ${activeTab === 'orders' ? 'bg-ink text-acid border-2 border-ink rounded-t-lg' : 'text-ink/60'}`}>
            <Package size={16} className="inline mr-2" />
            ORDERS
          </button>
          <button onClick={() => setActiveTab('addresses')} className={`px-6 py-3 font-display ${activeTab === 'addresses' ? 'bg-ink text-acid border-2 border-ink rounded-t-lg' : 'text-ink/60'}`}>
            <MapPin size={16} className="inline mr-2" />
            ADDRESSES
          </button>
          <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 font-display ${activeTab === 'profile' ? 'bg-ink text-acid border-2 border-ink rounded-t-lg' : 'text-ink/60'}`}>
            <User size={16} className="inline mr-2" />
            PROFILE
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-20"><Package size={64} className="mx-auto mb-4 text-ink/40" /><h3 className="font-display text-2xl mb-2">No Orders Yet</h3><p className="text-ink/60 mb-6">Start shopping to see your orders here</p><Link to="/products" className="inline-block bg-ink text-acid px-8 py-3 rounded-lg font-display border-2 border-ink hover:bg-acid hover:text-ink transition-colors">BROWSE PRODUCTS</Link></div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-paper border-2 border-ink rounded-xl p-6 shadow-hard">
                  <div className="flex justify-between items-start mb-4">
                    <div><div className="font-mono font-semibold">#{order.id}</div><div className="text-sm text-ink/60">{order.date}</div></div>
                    <span className={`px-3 py-1 rounded-lg border-2 border-ink font-semibold text-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.status.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div><span className="text-ink/60">{order.items} item(s) • </span><span className="font-display text-xl">KES {parseInt(order.total).toLocaleString()}</span></div>
                    <Link to={`/orders/${order.id}`} className="px-4 py-2 border-2 border-ink rounded-lg hover:bg-ink hover:text-acid transition-colors">View Details</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="text-center py-20"><MapPin size={64} className="mx-auto mb-4 text-ink/40" /><h3 className="font-display text-2xl mb-2">No Saved Addresses</h3><p className="text-ink/60">Add an address during checkout</p></div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-paper border-2 border-ink rounded-xl p-6 shadow-hard space-y-4">
              <div><label className="block font-semibold mb-2">Full Name</label><input type="text" defaultValue={user?.fullName} className="w-full px-4 py-3 border-2 border-ink rounded-lg" /></div>
              <div><label className="block font-semibold mb-2">Email</label><input type="email" defaultValue={user?.email} className="w-full px-4 py-3 border-2 border-ink rounded-lg" disabled /></div>
              <div><label className="block font-semibold mb-2">Phone</label><input type="tel" defaultValue={user?.phone || ''} className="w-full px-4 py-3 border-2 border-ink rounded-lg" /></div>
              <button className="bg-ink text-acid px-8 py-3 rounded-lg font-display border-2 border-ink hover:bg-acid hover:text-ink transition-colors">UPDATE PROFILE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}