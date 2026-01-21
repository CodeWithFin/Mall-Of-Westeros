import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { CreditCard, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      navigate('/order-confirmation/ORDER123');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <h1 className="font-display text-4xl md:text-6xl mb-8">CHECKOUT</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-paper border-2 border-ink rounded-xl p-6 shadow-hard">
              <h2 className="font-display text-2xl mb-4">SHIPPING ADDRESS</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
                <input type="text" placeholder="County" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
                <input type="text" placeholder="Town/City" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
                <textarea placeholder="Street Address" className="w-full px-4 py-3 border-2 border-ink rounded-lg" rows={3} required />
                <input type="text" placeholder="Apartment/Unit (optional)" className="w-full px-4 py-3 border-2 border-ink rounded-lg" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-paper border-2 border-ink rounded-xl p-6 shadow-hard">
              <h2 className="font-display text-2xl mb-4">PAYMENT METHOD</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button type="button" onClick={() => setPaymentMethod('card')} className={`p-4 border-2 border-ink rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-ink text-acid' : 'bg-paper'}`}>
                  <CreditCard size={20} />
                  Card
                </button>
                <button type="button" onClick={() => setPaymentMethod('mpesa')} className={`p-4 border-2 border-ink rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'mpesa' ? 'bg-ink text-acid' : 'bg-paper'}`}>
                  <Smartphone size={20} />
                  M-Pesa
                </button>
              </div>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
                    <input type="text" placeholder="CVV" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
                  </div>
                </div>
              )}
              {paymentMethod === 'mpesa' && (
                <input type="tel" placeholder="M-Pesa Phone Number (0712345678)" className="w-full px-4 py-3 border-2 border-ink rounded-lg" required />
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-stone/30 border-2 border-ink rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl mb-6">ORDER SUMMARY</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">KES 185,000</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="font-semibold text-green-600">FREE</span></div>
                <div className="border-t-2 border-ink pt-4 flex justify-between"><span className="font-display text-xl">Total</span><span className="font-display text-2xl">KES 185,000</span></div>
              </div>
              <button type="submit" disabled={isProcessing} className="w-full bg-ink text-acid py-4 rounded-lg font-display text-lg border-2 border-ink hover:bg-acid hover:text-ink transition-colors disabled:opacity-50">
                {isProcessing ? 'PROCESSING...' : 'COMPLETE ORDER'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}