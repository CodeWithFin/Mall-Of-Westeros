import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const subtotal = totalPrice;
  const shipping = subtotal >= 50000 ? 0 : 500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-paper">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-ink/40" />
          <h1 className="font-display text-4xl mb-4">Your Cart is Empty</h1>
          <p className="text-ink/60 mb-8">Add some amazing products to get started!</p>
          <Link
            to="/products"
            className="inline-block bg-ink text-acid px-8 py-3 rounded-lg font-display border-2 border-ink hover:bg-acid hover:text-ink transition-colors"
          >
            BROWSE PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="font-display text-4xl md:text-6xl mb-8">SHOPPING CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-paper border-2 border-ink rounded-xl p-6 shadow-hard flex gap-6">
                <Link to={`/products/${item.slug}`} className="w-24 h-24 bg-stone rounded-lg border-2 border-ink overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/200x200/E5E0D6/0A2A1F?text=${item.brand}`;
                    }}
                  />
                </Link>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-ink/60 uppercase mb-1">{item.brand}</div>
                  <Link to={`/products/${item.slug}`}>
                    <h3 className="font-display text-xl mb-2 hover:text-acid transition-colors">{item.name}</h3>
                  </Link>
                  <div className="font-display text-2xl">{formatPrice(item.price)}</div>
                  <div className="text-xs text-ink/50 mt-2">
                    {item.quantity > 1 && `${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(parseFloat(item.price) * item.quantity)}`}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="flex items-center border-2 border-ink rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 bg-stone hover:bg-ink hover:text-acid transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 bg-stone hover:bg-ink hover:text-acid transition-colors"
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-stone/30 border-2 border-ink rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl mb-6">ORDER SUMMARY</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal.toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping.toString())}</span>
                </div>
                <div className="border-t-2 border-ink pt-4 flex justify-between">
                  <span className="font-display text-xl">Total</span>
                  <span className="font-display text-2xl">{formatPrice(total.toString())}</span>
                </div>
              </div>
              <Link to="/checkout" className="w-full bg-ink text-acid py-3 rounded-lg font-display text-lg border-2 border-ink hover:bg-acid hover:text-ink transition-colors flex items-center justify-center gap-2 mb-4">
                PROCEED TO CHECKOUT
              </Link>
              <Link to="/products" className="block text-center text-ink/60 hover:text-ink font-semibold">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}