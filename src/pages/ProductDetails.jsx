import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, ArrowLeft, Check, Minus, Plus, Zap } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const cartItem = cartItems.find((item) => item.id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Check if Firebase is configured
        if (!db) {
          console.log('Firebase not configured, using demo data');
          throw new Error('Firebase not available');
        }
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Demo data if product not found in Firebase
          const demoProducts = {
            '1': {
              id: '1',
              name: 'Classic Black Watch',
              price: 1200,
              sku: 'AUR-001',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
              description: 'Elegant black dial with genuine leather strap. Perfect for formal occasions and everyday wear. Features precision quartz movement and water resistance up to 30 meters.',
            },
            '2': {
              id: '2',
              name: 'Luxury Gold Watch',
              price: 3500,
              sku: 'AUR-002',
              image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
              description: 'Premium gold-plated case with champagne dial. Sophisticated design for the modern gentleman. Features scratch-resistant mineral glass and 2-year warranty included.',
            },
            '3': {
              id: '3',
              name: 'Sport Digital Watch',
              price: 999,
              sku: 'AUR-003',
              image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600',
              description: 'Multi-function digital display with stopwatch, alarm, and backlight. Durable rubber strap for active lifestyle. Water-resistant up to 50 meters. Perfect for sports enthusiasts.',
            },
            '4': {
              id: '4',
              name: 'Minimalist Silver',
              price: 1500,
              sku: 'AUR-004',
              image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600',
              description: 'Ultra-thin silver case with clean white dial. Mesh stainless steel band for maximum comfort and style. The perfect accessory for minimalist fashion lovers.',
            },
            '5': {
              id: '5',
              name: 'Chronograph Pro',
              price: 2800,
              sku: 'AUR-005',
              image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600',
              description: 'Precision chronograph with three sub-dials and date window. Stainless steel bracelet with deployment clasp. Professional-grade timekeeping for the discerning collector.',
            },
            '6': {
              id: '6',
              name: 'Rose Gold Elite',
              price: 3200,
              sku: 'AUR-006',
              image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=600',
              description: 'Stunning rose gold finish with brown leather strap. Sapphire crystal glass for scratch resistance. Elegant design that transitions seamlessly from day to night.',
            },
            '7': {
              id: '7',
              name: 'Youth Casual Watch',
              price: 850,
              sku: 'AUR-007',
              image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600',
              description: 'Trendy and affordable timepiece for young professionals. Colorful nylon strap with easy-to-read dial. Lightweight and comfortable for all-day wear.',
            },
            '8': {
              id: '8',
              name: 'Executive Automatic',
              price: 4500,
              sku: 'AUR-008',
              image: 'https://images.unsplash.com/photo-1434056886845-dbe89f8f5f3d?w=600',
              description: 'Self-winding automatic movement with transparent case back. Premium alligator leather strap. The ultimate luxury timepiece for executives and watch enthusiasts.',
            },
          };
          setProduct(demoProducts[id] || demoProducts['1']);
        }
      } catch (error) {
        console.log('Using demo product:', error.message);
        // Demo data fallback
        const demoProducts = {
          '1': {
            id: '1',
            name: 'Classic Black Watch',
            price: 1200,
            sku: 'AUR-001',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
            description: 'Elegant black dial with genuine leather strap. Perfect for formal occasions and everyday wear.',
          },
          '2': {
            id: '2',
            name: 'Luxury Gold Watch',
            price: 3500,
            sku: 'AUR-002',
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
            description: 'Premium gold-plated case with champagne dial. Sophisticated design.',
          },
          '3': {
            id: '3',
            name: 'Sport Digital Watch',
            price: 999,
            sku: 'AUR-003',
            image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600',
            description: 'Multi-function digital display with stopwatch and alarm.',
          },
          '4': {
            id: '4',
            name: 'Minimalist Silver',
            price: 1500,
            sku: 'AUR-004',
            image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600',
            description: 'Ultra-thin silver case with clean white dial.',
          },
        };
        setProduct(demoProducts[id] || demoProducts['1']);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    // Store product with selected quantity in sessionStorage
    sessionStorage.setItem('buyNowItem', JSON.stringify({ ...product, quantity }));
    navigate('/checkout');
  };

  const adjustQuantity = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-aurvion-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen bg-aurvion-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Product not found</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-aurvion-black animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center text-gray-400 hover:text-aurvion-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-aurvion-dark rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600/1a1a1a/d4af37?text=Aurvion';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-aurvion-gold text-sm uppercase tracking-wider mb-2">
              {product.sku || 'AUR-XXX'}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-aurvion-gold mb-6">
              ৳{product.price.toLocaleString()}
            </p>
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-aurvion-dark rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-white mb-4">Product Features</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-aurvion-gold mr-2" />
                  Premium quality materials
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-aurvion-gold mr-2" />
                  2 year warranty included
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-aurvion-gold mr-2" />
                  Free delivery on orders over ৳2000
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-aurvion-gold mr-2" />
                  Cash on delivery available
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            {!cartItem && (
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-400">Quantity:</span>
                <div className="flex items-center bg-aurvion-dark rounded-lg border border-gray-800">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    className="p-3 text-gray-400 hover:text-aurvion-gold transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    className="p-3 text-gray-400 hover:text-aurvion-gold transition-colors"
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {cartItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-aurvion-gold/10 border border-aurvion-gold rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-aurvion-gold" />
                    <span className="text-aurvion-gold font-medium">
                      {cartItem.quantity} in cart
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/cart')}
                    className="text-sm text-aurvion-gold hover:text-white transition-colors"
                  >
                    View Cart
                  </button>
                </div>
                <button
                  onClick={() => navigate('/cart')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="btn-secondary w-full flex items-center justify-center space-x-2 border-aurvion-gold text-aurvion-gold hover:bg-aurvion-gold hover:text-aurvion-black"
                >
                  <Zap className="w-5 h-5" />
                  <span>Buy Now - ৳{(product.price * quantity).toLocaleString()}</span>
                </button>
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                    addedToCart ? 'bg-green-600 hover:bg-green-600' : ''
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
