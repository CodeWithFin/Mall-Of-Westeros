import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Top Marquee */}
      <div className="bg-ink text-paper overflow-hidden py-3 border-b-2 border-ink">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-12 mx-4 font-display uppercase text-sm tracking-widest">
            <span>✸ Premium Phones</span>
            <span>✸ Latest Laptops</span>
            <span>✸ Free Shipping KSH 50,000+</span>
            <span>✸ Authentic Products</span>
            <span>✸ Premium Phones</span>
            <span>✸ Latest Laptops</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-4 z-50 px-4 md:px-8 mb-8">
        <div className="bg-paper/80 backdrop-blur-md border-2 border-ink rounded-xl shadow-hard flex justify-between items-center p-4">
          <Link to="/" className="text-2xl md:text-3xl font-display tracking-tighter flex items-center gap-1">
            MALL<span className="text-acid">OW</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <Link to="/products?category=phone" className="hover:text-acid hover:bg-ink px-3 py-1 rounded transition-colors">
              PHONES
            </Link>
            <Link to="/products?category=laptop" className="hover:text-acid hover:bg-ink px-3 py-1 rounded transition-colors">
              LAPTOPS
            </Link>
            <Link to="/products" className="hover:text-acid hover:bg-ink px-3 py-1 rounded transition-colors">
              ALL PRODUCTS
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/account'}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-ink hover:bg-ink hover:text-acid transition-colors"
                >
                  <User size={16} />
                  {user.fullName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-ink hover:bg-ink hover:text-acid transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-ink hover:bg-ink hover:text-acid transition-colors"
              >
                <User size={16} />
                Login
              </Link>
            )}
            <Link 
              to="/cart" 
              className="bg-ink text-acid px-4 py-2 rounded-lg font-display text-sm border-2 border-ink hover:bg-acid hover:text-ink transition-colors flex items-center gap-2 group relative"
            >
              <ShoppingBag size={16} />
              CART ({totalItems})
              {totalItems > 0 && (
                <div className="w-2 h-2 bg-acid rounded-full group-hover:bg-ink animate-pulse absolute -top-1 -right-1" />
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
