import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, user } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but not admin when admin is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="bg-white border-4 border-ink rounded-lg p-8 max-w-md text-center" style={{ boxShadow: '4px 4px 0 #0A2A1F' }}>
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="font-display text-3xl text-ink mb-4">Access Denied</h1>
          <p className="text-lg mb-6">You need administrator privileges to access this page.</p>
          <a
            href="/"
            className="inline-block bg-ink text-paper px-6 py-3 rounded-lg font-bold border-4 border-ink hover:bg-paper hover:text-ink transition-colors"
            style={{ boxShadow: '4px 4px 0 #0A2A1F' }}
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // All checks passed - render children
  return <>{children}</>;
}
