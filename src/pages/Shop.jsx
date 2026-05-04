import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if Firebase is configured
        if (!db) {
          console.log('Firebase not configured, using demo data');
          throw new Error('Firebase not available');
        }
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // If no products in Firebase, use demo data
        if (productsData.length === 0) {
          throw new Error('No products in database');
        }
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.log('Using demo products:', error.message);
        // Demo data if Firebase not configured
        const demoProducts = [
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
        ];
        setProducts(demoProducts);
        setFilteredProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter((p) => {
        if (max) {
          return p.price >= min && p.price <= max;
        }
        return p.price >= min;
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, priceRange, products]);

  return (
    <div className="pt-20 min-h-screen bg-aurvion-black animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our Collection
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our complete collection of premium men's watches. 
            Find the perfect timepiece to match your style.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-aurvion-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurvion-gold transition-colors"
            />
          </div>

          {/* Price Filter */}
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-aurvion-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:border-aurvion-gold transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="0-1499">৳0 - ৳1,499</option>
              <option value="1500-2499">৳1,500 - ৳2,499</option>
              <option value="2500-3499">৳2,500 - ৳3,499</option>
              <option value="3500">৳3,500+</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-400 mb-6">
          Showing {filteredProducts.length} watch{filteredProducts.length !== 1 ? 'es' : ''}
        </p>

        {/* Products Grid */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No watches found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
