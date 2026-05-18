'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState({
    name: '', category: 'phone' as 'phone' | 'laptop', brand: '', model: '', description: '',
    price: '', stockQuantity: '', images: [''], isFeatured: false, isActive: true,
  });
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products', selectedCategory],
    queryFn: async () => {
      let url = '/api/products';
      if (selectedCategory !== 'all') url += `?category=${selectedCategory}`;
      const res = await fetch(url);
      const json = await res.json();
      return json.data.products;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const isEdit = !!editingProduct;
      const res = await fetch(isEdit ? `/api/products/${editingProduct!.id}` : '/api/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowModal(false);
      setEditingProduct(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity, 10),
      specifications: {},
    });
  };

  return (
    <div>
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 mb-2 inline-block">← Dashboard</Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Manage Products</h1>
        <button type="button" onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">
          <Plus size={18} /> Add Product
        </button>
      </div>
      <div className="flex gap-2 mb-6">
        {['all', 'phone', 'laptop'].map((cat) => (
          <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg text-sm capitalize ${selectedCategory === cat ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200'}`}>{cat}</button>
        ))}
      </div>
      {isLoading ? <p>Loading…</p> : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: { id: string; name: string; brand: string; category: string; price: string; stockQuantity: number }) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="p-4 font-medium">{p.name}<br /><span className="text-slate-500 text-xs">{p.brand}</span></td>
                  <td className="p-4 capitalize">{p.category}</td>
                  <td className="p-4">{formatPrice(p.price)}</td>
                  <td className="p-4">{p.stockQuantity}</td>
                  <td className="p-4 text-right">
                    <button type="button" onClick={() => { setEditingProduct(p); setShowModal(true); }} className="p-2 hover:bg-slate-100 rounded"><Edit size={16} /></button>
                    <button type="button" onClick={() => confirm('Delete?') && deleteMutation.mutate(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">{editingProduct ? 'Edit' : 'Add'} Product</h2>
              <button type="button" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" required />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as 'phone' | 'laptop' })} className="w-full border border-slate-200 rounded-lg px-3 py-2">
                <option value="phone">Phone</option>
                <option value="laptop">Laptop</option>
              </select>
              <input placeholder="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" required />
              <input placeholder="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" required />
              <input placeholder="Stock" type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" required />
              <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-lg">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
