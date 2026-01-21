import { Link } from 'react-router-dom';
import { ShoppingBag, Laptop, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
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
            <Link to="/products?category=phone" className="hover:text-acid hover:bg-ink px-3 py-1 rounded transition-colors">PHONES</Link>
            <Link to="/products?category=laptop" className="hover:text-acid hover:bg-ink px-3 py-1 rounded transition-colors">LAPTOPS</Link>
            <Link to="/products" className="hover:text-acid hover:bg-ink px-3 py-1 rounded transition-colors">ALL PRODUCTS</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="bg-ink text-acid px-4 py-2 rounded-lg font-display text-sm border-2 border-ink hover:bg-acid hover:text-ink transition-colors flex items-center gap-2">
              <ShoppingBag size={16} />
              CART
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-ink text-paper rounded-3xl p-12 md:p-20 border-2 border-ink shadow-hard-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="font-display text-5xl md:text-7xl mb-6 leading-none">
              PREMIUM<br />TECH FOR<br /><span className="text-acid">WESTEROS</span>
            </h1>
            <p className="text-lg md:text-xl max-w-xl mb-8 opacity-90">
              Discover the latest phones and laptops. Authentic products, competitive prices, fast delivery.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-acid text-ink px-8 py-4 rounded-xl font-display text-lg border-2 border-acid hover:bg-paper hover:border-paper transition-colors shadow-hard">
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h2 className="font-display text-3xl md:text-4xl mb-8">SHOP BY CATEGORY</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/products?category=phone" className="bg-white border-2 border-ink rounded-2xl p-12 hover:shadow-hard-xl transition-all group">
            <Smartphone size={48} className="mb-4 group-hover:text-acid transition-colors" />
            <h3 className="font-display text-3xl mb-2">PHONES</h3>
            <p className="text-ink/60 font-medium">Latest smartphones from top brands</p>
          </Link>
          <Link to="/products?category=laptop" className="bg-white border-2 border-ink rounded-2xl p-12 hover:shadow-hard-xl transition-all group">
            <Laptop size={48} className="mb-4 group-hover:text-acid transition-colors" />
            <h3 className="font-display text-3xl mb-2">LAPTOPS</h3>
            <p className="text-ink/60 font-medium">Powerful laptops for work and play</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-paper py-12 mt-20 border-t-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-2xl mb-4">MALL<span className="text-acid">OW</span></h3>
              <p className="text-sm opacity-60">Premium phones and laptops for Westeros</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/products?category=phone" className="hover:text-acid">Phones</Link></li>
                <li><Link to="/products?category=laptop" className="hover:text-acid">Laptops</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">ACCOUNT</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/login" className="hover:text-acid">Login</Link></li>
                <li><Link to="/register" className="hover:text-acid">Register</Link></li>
                <li><Link to="/account" className="hover:text-acid">My Orders</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-paper/20 text-center text-sm opacity-40">
            © 2026 Mall of Westeros. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
