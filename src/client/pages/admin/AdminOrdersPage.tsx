import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { Eye, Package } from 'lucide-react';

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Orders will be fetched from API
  const orders: any[] = [];
  const filteredOrders = selectedStatus === 'all' ? orders : orders.filter(o => o.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-700';
      case 'paid': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-purple-100 text-purple-700';
      case 'shipped': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <Link to="/admin" className="text-ink/60 hover:text-ink mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="font-display text-4xl md:text-6xl">MANAGE ORDERS</h1>
          <p className="text-ink/60 mt-2">{filteredOrders.length} orders</p>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setSelectedStatus('all')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedStatus === 'all' ? 'bg-ink text-acid' : 'bg-paper'}`}>All</button>
          <button onClick={() => setSelectedStatus('pending_payment')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedStatus === 'pending_payment' ? 'bg-ink text-acid' : 'bg-paper'}`}>Pending Payment</button>
          <button onClick={() => setSelectedStatus('paid')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedStatus === 'paid' ? 'bg-ink text-acid' : 'bg-paper'}`}>Paid</button>
          <button onClick={() => setSelectedStatus('shipped')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedStatus === 'shipped' ? 'bg-ink text-acid' : 'bg-paper'}`}>Shipped</button>
          <button onClick={() => setSelectedStatus('delivered')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedStatus === 'delivered' ? 'bg-ink text-acid' : 'bg-paper'}`}>Delivered</button>
        </div>

        {/* Orders Table */}
        <div className="bg-paper border-2 border-ink rounded-xl shadow-hard overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone/50 border-b-2 border-ink">
              <tr>
                <th className="text-left p-4 font-display">ORDER ID</th>
                <th className="text-left p-4 font-display">DATE</th>
                <th className="text-left p-4 font-display">CUSTOMER</th>
                <th className="text-left p-4 font-display">ITEMS</th>
                <th className="text-left p-4 font-display">TOTAL</th>
                <th className="text-left p-4 font-display">STATUS</th>
                <th className="text-right p-4 font-display">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-ink/20 hover:bg-stone/20">
                  <td className="p-4 font-mono font-semibold">#{order.id}</td>
                  <td className="p-4 text-sm">{order.date}</td>
                  <td className="p-4">
                    <div className="font-semibold">{order.customer}</div>
                    <div className="text-sm text-ink/60">{order.email}</div>
                  </td>
                  <td className="p-4">{order.items} item(s)</td>
                  <td className="p-4 font-display text-lg">KES {parseInt(order.total).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded border border-ink text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 hover:bg-stone rounded" title="View Details"><Eye size={16} /></button>
                      <button className="p-2 hover:bg-stone rounded" title="Update Status"><Package size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}