import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '../../components/Navigation';
import { Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'phone' as 'phone' | 'laptop',
    brand: '',
    model: '',
    description: '',
    price: '',
    stockQuantity: '',
    images: [''],
    isFeatured: false,
    isActive: true,
  });
  
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products', selectedCategory],
    queryFn: async () => {
      let url = '/api/products';
      if (selectedCategory !== 'all') url += `?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data.data.products;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'phone',
      brand: '',
      model: '',
      description: '',
      price: '',
      stockQuantity: '',
      images: [''],
      isFeatured: false,
      isActive: true,
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      model: product.model,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity.toString(),
      images: product.images,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      specifications: {}, // Add default empty specifications
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/admin" className="text-ink/60 hover:text-ink mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="font-display text-4xl md:text-6xl">MANAGE PRODUCTS</h1>
          </div>
          <button 
            onClick={() => { setEditingProduct(null); resetForm(); setShowModal(true); }}
            className="bg-ink text-acid px-6 py-3 rounded-lg font-display border-2 border-ink hover:bg-acid hover:text-ink transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            ADD PRODUCT
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedCategory === 'all' ? 'bg-ink text-acid' : 'bg-paper'}`}>All</button>
          <button onClick={() => setSelectedCategory('phone')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedCategory === 'phone' ? 'bg-ink text-acid' : 'bg-paper'}`}>Phones</button>
          <button onClick={() => setSelectedCategory('laptop')} className={`px-4 py-2 rounded-lg border-2 border-ink font-semibold ${selectedCategory === 'laptop' ? 'bg-ink text-acid' : 'bg-paper'}`}>Laptops</button>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="text-center py-20">Loading...</div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 bg-paper border-2 border-ink rounded-xl">
            <p className="text-xl text-ink/60 mb-4">No products found</p>
            <button 
              onClick={() => { setEditingProduct(null); resetForm(); setShowModal(true); }}
              className="bg-ink text-acid px-6 py-3 rounded-lg font-display border-2 border-ink hover:bg-acid hover:text-ink transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-paper border-2 border-ink rounded-xl shadow-hard overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone/50 border-b-2 border-ink">
                <tr>
                  <th className="text-left p-4 font-display">PRODUCT</th>
                  <th className="text-left p-4 font-display">CATEGORY</th>
                  <th className="text-left p-4 font-display">PRICE</th>
                  <th className="text-left p-4 font-display">STOCK</th>
                  <th className="text-left p-4 font-display">STATUS</th>
                  <th className="text-right p-4 font-display">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: any) => (
                  <tr key={product.id} className="border-b border-ink/20 hover:bg-stone/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-stone rounded border border-ink">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/E5E0D6/0A2A1F?text=${product.brand}`; }} />
                        </div>
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-ink/60">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{product.category}</td>
                    <td className="p-4 font-semibold">KES {parseInt(product.price).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${product.stockQuantity === 0 ? 'bg-red-100 text-red-700' : product.stockQuantity <= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{product.stockQuantity}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{product.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-stone rounded" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product.id, product.name)} className="p-2 hover:bg-red-50 text-red-600 rounded" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-paper border-2 border-ink rounded-xl shadow-hard-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b-2 border-ink">
              <h2 className="font-display text-2xl">{editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h2>
              <button onClick={() => { setShowModal(false); setEditingProduct(null); }} className="p-2 hover:bg-stone rounded"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Product Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" required />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as any })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" required>
                    <option value="phone">Phone</option>
                    <option value="laptop">Laptop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Brand</label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" required />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Model</label>
                  <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" required />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" rows={3} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Price (KES)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" required />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Stock Quantity</label>
                  <input type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" required />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Image URL</label>
                <input type="url" value={formData.images[0]} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} className="w-full px-4 py-2 border-2 border-ink rounded-lg" required placeholder="https://example.com/image.jpg" />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4" />
                  <span className="font-semibold">Featured Product</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                  <span className="font-semibold">Active</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-ink text-acid py-3 rounded-lg font-display border-2 border-ink hover:bg-acid hover:text-ink transition-colors">
                  {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setEditingProduct(null); }} className="px-6 py-3 rounded-lg border-2 border-ink hover:bg-stone transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}