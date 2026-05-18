import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Admin — Mall of Westeros',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/admin" className="text-xl font-semibold text-slate-800">
              <span className="text-green-600">mall</span>ow Admin
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/admin" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
              <Link href="/admin/products" className="text-slate-600 hover:text-slate-900">Products</Link>
              <Link href="/admin/orders" className="text-slate-600 hover:text-slate-900">Orders</Link>
              <Link href="/" className="text-green-600 hover:underline">Storefront</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
