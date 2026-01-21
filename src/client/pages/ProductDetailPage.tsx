import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, ChevronLeft, ChevronRight, Star, Shield, 
  Truck, Lock, Maximize2, Package, FileText, Cpu, Plus 
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [whatsIncludedOpen, setWhatsIncludedOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/slug/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
  });

  const product = response?.data;

  // Fetch related products
  const { data: relatedResponse } = useQuery({
    queryKey: ['products', 'related', product?.category],
    queryFn: async () => {
      if (!product) return null;
      const res = await fetch(`/api/products?category=${product.category}&limit=4`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!product,
  });

  const relatedProducts = relatedResponse?.data?.products?.filter((p: any) => p.id !== product?.id).slice(0, 4) || [];

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-stone/30 rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <div className="aspect-square bg-stone/30 rounded-[2rem]" />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <div className="h-12 bg-stone/30 rounded w-3/4" />
                <div className="h-8 bg-stone/30 rounded w-1/2" />
                <div className="h-32 bg-stone/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-paper">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="font-display text-4xl mb-4">Product Not Found</h1>
          <Link to="/products" className="text-acid underline font-semibold">Browse all products</Link>
        </div>
      </div>
    );
  }

  const specs = typeof product.specifications === 'string' 
    ? JSON.parse(product.specifications) 
    : product.specifications;

  const images = Array.isArray(product.images) ? product.images : [product.images];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    
    // Reset the "added" state after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-paper pb-24 md:pb-0">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-semibold opacity-60 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-ink hover:underline">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-ink hover:underline">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/products?category=${product.category}`} className="hover:text-ink hover:underline capitalize">{product.category}s</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-ink opacity-100 border-b-2 border-acid">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 lg:sticky lg:top-32">
            <div className="relative bg-white border-2 border-ink rounded-[2rem] shadow-hard-xl overflow-hidden aspect-square group mb-6">
              {product.isFeatured && (
                <div className="absolute top-6 left-6 z-20 -rotate-6">
                  <div className="bg-ink text-acid px-4 py-2 rounded-lg border-2 border-acid shadow-md flex items-center gap-2">
                    <Star className="w-4 h-4 fill-acid" />
                    <span className="font-display text-xs tracking-wider">Featured</span>
                  </div>
                </div>
              )}
              
              <img
                src={images[selectedImage] || '/placeholder-product.png'}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain p-4 md:p-6 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/800x800/E5E0D6/0A2A1F?text=${product.brand}`;
                }}
              />
              
              <div className="absolute bottom-6 right-6 z-20">
                <button className="bg-paper p-3 rounded-full border-2 border-ink shadow-hard hover:bg-acid transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative rounded-xl border-2 overflow-hidden aspect-square bg-white hover:-translate-y-1 transition-transform ${
                      selectedImage === idx ? 'border-acid shadow-hard-sm' : 'border-ink opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/200x200/E5E0D6/0A2A1F?text=${idx + 1}`;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="border-b-2 border-ink/10 pb-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest opacity-60">{product.brand}</h2>
                {product.stockQuantity > 0 && (
                  <div className="flex items-center gap-1 text-ink bg-acid/30 px-2 py-1 rounded text-xs font-bold">
                    <Star className="w-3 h-3 fill-ink stroke-none" />
                    {product.category === 'phone' ? '4.8' : '4.9'} ({Math.floor(Math.random() * 50) + 20} reviews)
                  </div>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl leading-none text-ink mb-4 tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl text-ink">{formatPrice(product.price)}</span>
                {product.stockQuantity > 0 ? (
                  <span className="bg-ink text-acid text-xs font-bold px-2 py-1 rounded">IN STOCK</span>
                ) : (
                  <span className="bg-stone text-ink text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</span>
                )}
              </div>
            </div>

            {/* Product Highlight */}
            <div className="bg-white border-2 border-ink rounded-xl p-6 relative shadow-sm">
              <div className="absolute -top-3 left-4 bg-acid border-2 border-ink px-3 py-1 rounded-full flex items-center gap-2">
                <Cpu className="w-3 h-3 stroke-[2]" />
                <span className="text-xs font-bold uppercase tracking-wide">Key Features</span>
              </div>
              <p className="text-sm md:text-base leading-relaxed font-medium mt-2">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {product.category === 'phone' ? (
                  <>
                    {specs.camera && <span className="border border-ink rounded-full px-3 py-1 text-xs font-bold hover:bg-ink hover:text-paper transition-colors cursor-default">{specs.camera}</span>}
                    {specs.ram && <span className="border border-ink rounded-full px-3 py-1 text-xs font-bold hover:bg-ink hover:text-paper transition-colors cursor-default">{specs.ram} RAM</span>}
                    {specs.battery && <span className="border border-ink rounded-full px-3 py-1 text-xs font-bold hover:bg-ink hover:text-paper transition-colors cursor-default">{specs.battery}</span>}
                  </>
                ) : (
                  <>
                    {specs.processor && <span className="border border-ink rounded-full px-3 py-1 text-xs font-bold hover:bg-ink hover:text-paper transition-colors cursor-default">{specs.processor}</span>}
                    {specs.ram && <span className="border border-ink rounded-full px-3 py-1 text-xs font-bold hover:bg-ink hover:text-paper transition-colors cursor-default">{specs.ram} RAM</span>}
                    {specs.graphicsCard && <span className="border border-ink rounded-full px-3 py-1 text-xs font-bold hover:bg-ink hover:text-paper transition-colors cursor-default">{specs.graphicsCard}</span>}
                  </>
                )}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stockQuantity > 0 && (
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex gap-4">
                  <div className="flex items-center border-2 border-ink rounded-xl bg-white h-14 w-32 shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 h-full hover:bg-acid/30 rounded-l-lg transition-colors flex items-center justify-center font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="font-display text-xl w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="flex-1 h-full hover:bg-acid/30 rounded-r-lg transition-colors flex items-center justify-center font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`flex-1 border-2 border-ink rounded-xl font-display text-lg tracking-wide hover:shadow-hard hover:-translate-y-1 hover:-translate-x-1 transition-all flex items-center justify-center gap-3 shadow-hard-sm ${
                      addedToCart 
                        ? 'bg-acid text-ink' 
                        : 'bg-ink text-acid'
                    }`}
                  >
                    {addedToCart ? '✓ ADDED!' : 'ADD TO CART'} <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-[10px] md:text-xs font-bold text-center opacity-70">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" /> Authentic
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Truck className="w-3 h-3" /> Fast Ship
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Secure
                  </div>
                </div>
              </div>
            )}

            {/* Accordions */}
            <div className="space-y-4">
              {/* What's Included */}
              <details 
                className="group bg-paper border-2 border-ink rounded-xl overflow-hidden cursor-pointer"
                open={whatsIncludedOpen}
                onToggle={(e) => setWhatsIncludedOpen((e.target as HTMLDetailsElement).open)}
              >
                <summary className="flex items-center justify-between p-4 font-bold select-none hover:bg-white transition-colors">
                  <span className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-ink" />
                    What's In The Box
                  </span>
                  <Plus className={`w-5 h-5 transition-transform ${whatsIncludedOpen ? 'rotate-45' : ''}`} />
                </summary>
                <div className="p-6 pt-0 border-t-2 border-dashed border-ink/10 mt-2 bg-white">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-acid rounded-full" />
                      1x {product.name}
                    </li>
                    {product.category === 'phone' ? (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-acid rounded-full" />
                          USB-C Charging Cable
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-acid rounded-full" />
                          SIM Ejector Tool
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-acid rounded-full" />
                          Quick Start Guide
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-acid rounded-full" />
                          Power Adapter
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-acid rounded-full" />
                          USB-C Cable
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-acid rounded-full" />
                          User Manual & Warranty Card
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </details>

              {/* Full Description */}
              <details 
                className="group bg-white border-2 border-ink rounded-xl overflow-hidden cursor-pointer"
                open={descOpen}
                onToggle={(e) => setDescOpen((e.target as HTMLDetailsElement).open)}
              >
                <summary className="flex items-center justify-between p-4 font-bold select-none hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-ink/60" />
                    Full Description
                  </span>
                  <Plus className={`w-5 h-5 transition-transform ${descOpen ? 'rotate-45' : ''}`} />
                </summary>
                <div className="p-4 pt-0 text-sm leading-relaxed opacity-80 border-t-2 border-dashed border-ink/10 mt-2">
                  <p className="mb-3">{product.description}</p>
                  <p className="text-xs opacity-60">
                    Model: {product.model} | Brand: {product.brand} | Category: {product.category}
                  </p>
                </div>
              </details>

              {/* Specifications */}
              <details 
                className="group bg-white border-2 border-ink rounded-xl overflow-hidden cursor-pointer"
                open={specsOpen}
                onToggle={(e) => setSpecsOpen((e.target as HTMLDetailsElement).open)}
              >
                <summary className="flex items-center justify-between p-4 font-bold select-none hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-ink/60" />
                    Technical Specifications
                  </span>
                  <Plus className={`w-5 h-5 transition-transform ${specsOpen ? 'rotate-45' : ''}`} />
                </summary>
                <div className="p-4 pt-0 border-t-2 border-dashed border-ink/10 mt-2">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-ink/10 last:border-0">
                        <span className="font-bold text-xs uppercase opacity-50 min-w-[100px]">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-right font-semibold">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 border-t-2 border-ink bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="font-display text-3xl md:text-5xl tracking-tighter text-ink">YOU MIGHT ALSO LIKE</h2>
                <p className="font-medium opacity-60 mt-2">Complete your setup with these.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.slug}`}
                  className="group relative bg-paper border-2 border-ink rounded-2xl overflow-hidden hover:shadow-hard-xl transition-all duration-300"
                >
                  {relatedProduct.isFeatured && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-white border border-ink px-2 py-0.5 text-[10px] font-bold rounded uppercase">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="aspect-[4/5] bg-white border-b-2 border-ink relative overflow-hidden p-6 flex items-center justify-center">
                    <img
                      src={Array.isArray(relatedProduct.images) ? relatedProduct.images[0] : relatedProduct.images}
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x400/E5E0D6/0A2A1F?text=${relatedProduct.brand}`;
                      }}
                    />
                    <div className="absolute inset-x-4 bottom-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                      <button className="w-full bg-ink text-acid font-display text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2">
                        View <span className="font-sans font-bold">{formatPrice(relatedProduct.price)}</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg leading-none mb-1">{relatedProduct.name}</h3>
                    <div className="flex gap-1 text-[10px] font-bold text-ink/50 uppercase">
                      <span>{relatedProduct.brand}</span> • <span className="capitalize">{relatedProduct.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fixed Bottom Bar for Mobile Only */}
      {product.stockQuantity > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-ink md:hidden z-40">
          <button 
            onClick={handleAddToCart}
            disabled={addedToCart}
            className={`w-full border-2 border-ink rounded-xl font-display text-lg py-3 shadow-hard-sm flex items-center justify-center gap-2 ${
              addedToCart 
                ? 'bg-acid text-ink' 
                : 'bg-ink text-acid'
            }`}
          >
            {addedToCart ? '✓ ADDED TO CART!' : `ADD TO CART - ${formatPrice(product.price)}`}
          </button>
        </div>
      )}
    </div>
  );
}