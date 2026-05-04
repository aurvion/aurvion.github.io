import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    // Store product in sessionStorage for Buy Now
    sessionStorage.setItem('buyNowItem', JSON.stringify({ ...product, quantity: 1 }));
    navigate('/checkout');
  };

  return (
    <div className="card group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400/1a1a1a/d4af37?text=Aurvion';
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="bg-white text-aurvion-black p-3 rounded-full hover:bg-aurvion-gold transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-aurvion-gold text-aurvion-black p-3 rounded-full hover:bg-aurvion-gold-light transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-aurvion-gold mb-1 uppercase tracking-wider">
          {product.sku || 'AUR-XXX'}
        </p>
        <h3 className="font-display text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-aurvion-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-aurvion-gold">
            ৳{product.price.toLocaleString()}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBuyNow}
              className="text-sm text-aurvion-gold hover:text-aurvion-gold-light font-medium transition-colors flex items-center"
            >
              <Zap className="w-4 h-4 mr-1" />
              Buy Now
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={handleAddToCart}
              className="text-sm text-gray-400 hover:text-aurvion-gold transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
