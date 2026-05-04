import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Watch, Shield, Truck } from 'lucide-react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Check if Firebase is configured
        if (!db) {
          console.log('Firebase not configured, using demo data');
          throw new Error('Firebase not available');
        }
        const q = query(collection(db, 'products'), limit(6));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // If no products in Firebase, use demo data
        if (products.length === 0) {
          throw new Error('No products in database');
        }
        setFeaturedProducts(products);
      } catch (error) {
        console.log('Using demo products:', error.message);
        // Demo data if Firebase not configured
        setFeaturedProducts([
          {
            id: '1',
            name: 'Classic Black Watch',
            price: 1200,
            sku: 'AUR-001',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            description: 'Elegant black dial with genuine leather strap. Perfect for formal occasions and everyday wear. Water-resistant up to 30 meters.',
          },
          {
            id: '2',
            name: 'Luxury Gold Watch',
            price: 3500,
            sku: 'AUR-002',
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
            description: 'Premium gold-plated case with champagne dial. Sophisticated design for the modern gentleman. 2-year warranty included.',
          },
          {
            id: '3',
            name: 'Sport Digital Watch',
            price: 999,
            sku: 'AUR-003',
            image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400',
            description: 'Multi-function digital display with stopwatch, alarm, and backlight. Durable rubber strap for active lifestyle.',
          },
          {
            id: '4',
            name: 'Minimalist Silver',
            price: 1500,
            sku: 'AUR-004',
            image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400',
            description: 'Ultra-thin silver case with clean white dial. Mesh stainless steel band for maximum comfort and style.',
          },
          {
            id: '5',
            name: 'Chronograph Pro',
            price: 2800,
            sku: 'AUR-005',
            image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
            description: 'Precision chronograph with three sub-dials and date window. Stainless steel bracelet with deployment clasp.',
          },
          {
            id: '6',
            name: 'Rose Gold Elite',
            price: 3200,
            sku: 'AUR-006',
            image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=400',
            description: 'Stunning rose gold finish with brown leather strap. Sapphire crystal glass for scratch resistance.',
          },
          {
            id: '7',
            name: 'Youth Casual Watch',
            price: 850,
            sku: 'AUR-007',
            image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
            description: 'Trendy and affordable timepiece for young professionals. Colorful nylon strap with easy-to-read dial.',
          },
          {
            id: '8',
            name: 'Executive Automatic',
            price: 4500,
            sku: 'AUR-008',
            image: 'https://images.unsplash.com/photo-1434056886845-dbe89f8f5f3d?w=400',
            description: 'Self-winding automatic movement with transparent case back. Premium alligator leather strap.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-aurvion-black via-aurvion-dark to-aurvion-black" />
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-aurvion-gold text-sm uppercase tracking-[0.3em] mb-4 animate-slide-up">
            Premium Timepieces
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Define Your
            <span className="block text-gold-gradient">Time</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover our collection of premium men's watches. 
            Crafted for the modern gentleman who values elegance and precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/shop" className="btn-primary flex items-center space-x-2">
              <span>Shop Collection</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/shop" className="btn-secondary">
              View All Watches
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-aurvion-gold rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-aurvion-gold rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-aurvion-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 p-6 bg-aurvion-black rounded-xl border border-gray-800">
              <div className="p-3 bg-aurvion-gold/10 rounded-lg">
                <Truck className="w-6 h-6 text-aurvion-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Free Delivery</h3>
                <p className="text-gray-400 text-sm">On all orders over ৳2000</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-aurvion-black rounded-xl border border-gray-800">
              <div className="p-3 bg-aurvion-gold/10 rounded-lg">
                <Shield className="w-6 h-6 text-aurvion-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-white">2 Year Warranty</h3>
                <p className="text-gray-400 text-sm">On all timepieces</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-aurvion-black rounded-xl border border-gray-800">
              <div className="p-3 bg-aurvion-gold/10 rounded-lg">
                <Watch className="w-6 h-6 text-aurvion-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Premium Quality</h3>
                <p className="text-gray-400 text-sm">Handcrafted watches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-aurvion-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-aurvion-gold text-sm uppercase tracking-wider mb-2">Curated Selection</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Watches
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Handpicked timepieces that represent the finest in our collection
            </p>
          </div>

          {loading ? (
            <div className="py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/shop" className="btn-secondary inline-flex items-center space-x-2">
                  <span>View All Watches</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-aurvion-gold/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              Elevate Your Style
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of satisfied customers who trust Aurvion for their timepiece needs.
            </p>
            <Link to="/shop" className="btn-primary text-lg px-8 py-4">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
