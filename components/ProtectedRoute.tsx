'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null && typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) router.replace('/login');
    }
  }, [user, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500">
        Checking authentication…
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md text-center shadow-lg">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">You need administrator privileges to access this page.</p>
          <Link href="/" className="inline-block bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
