import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: string;
  images: string[];
  stockQuantity: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="bg-paper border-2 border-ink rounded-xl shadow-hard hover:shadow-hard-xl transition-all overflow-hidden">
        {/* Image */}
        <div className="aspect-square bg-stone overflow-hidden border-b-2 border-ink relative">
          <img
            src={product.images[0] || '/placeholder-product.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x400/E5E0D6/0A2A1F?text=${product.brand}`;
            }}
          />
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-ink/80 flex items-center justify-center">
              <span className="bg-acid text-ink px-4 py-2 rounded-lg font-display text-sm">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-xs font-semibold text-ink/60 uppercase mb-1">
            {product.brand}
          </div>
          <h3 className="font-display text-lg leading-tight mb-2 group-hover:text-acid transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-4">
            <div className="font-display text-2xl">
              {formatPrice(product.price)}
            </div>
            
            {product.stockQuantity > 0 && (
              <button 
                onClick={handleAddToCart}
                className={`px-3 py-2 rounded-lg border-2 border-ink transition-colors flex items-center gap-2 ${
                  added 
                    ? 'bg-acid text-ink' 
                    : 'bg-ink text-acid hover:bg-acid hover:text-ink'
                }`}
              >
                {added ? '✓' : <ShoppingCart size={16} />}
              </button>
            )}
          </div>

          {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
            <div className="mt-2 text-xs font-semibold text-red-600">
              Only {product.stockQuantity} left!
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
