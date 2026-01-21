import { Link, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { CheckCircle, Package, Truck } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl mb-4">ORDER CONFIRMED!</h1>
          <p className="text-xl text-ink/60 mb-2">Thank you for your purchase</p>
          <p className="font-mono text-lg">Order #{orderId}</p>
        </div>

        <div className="bg-paper border-2 border-ink rounded-xl p-8 shadow-hard-xl mb-8">
          <h2 className="font-display text-2xl mb-6">What happens next?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-ink text-acid rounded-full flex items-center justify-center font-display">1</div>
              <div>
                <h3 className="font-display text-lg mb-1">Order Processing</h3>
                <p className="text-ink/60">We're preparing your items for shipment</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-stone border-2 border-ink rounded-full flex items-center justify-center"><Package size={20} /></div>
              <div>
                <h3 className="font-display text-lg mb-1">Quality Check</h3>
                <p className="text-ink/60">Ensuring everything is perfect</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-stone border-2 border-ink rounded-full flex items-center justify-center"><Truck size={20} /></div>
              <div>
                <h3 className="font-display text-lg mb-1">Shipping</h3>
                <p className="text-ink/60">Delivery within 2-5 business days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/account" className="bg-ink text-acid px-8 py-3 rounded-lg font-display border-2 border-ink hover:bg-acid hover:text-ink transition-colors">
            VIEW ORDER DETAILS
          </Link>
          <Link to="/products" className="bg-paper px-8 py-3 rounded-lg font-display border-2 border-ink hover:bg-stone transition-colors">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}