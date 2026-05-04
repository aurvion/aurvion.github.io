import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-aurvion-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-400 mb-6">
            Looks like you haven't added any watches yet.
          </p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-aurvion-black animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-aurvion-dark rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-gray-800"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100/1a1a1a/d4af37?text=Aurvion';
                  }}
                />

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-aurvion-gold uppercase tracking-wider">
                    {item.sku || 'AUR-XXX'}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.name}
                  </h3>
                  <p className="text-aurvion-gold font-bold">
                    ৳{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 bg-aurvion-black rounded-lg text-gray-400 hover:text-aurvion-gold transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 bg-aurvion-black rounded-lg text-gray-400 hover:text-aurvion-gold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Total & Remove */}
                <div className="text-center sm:text-right">
                  <p className="font-bold text-white text-lg">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors mt-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-aurvion-dark rounded-xl p-6 border border-gray-800 sticky top-24">
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span>{total >= 2000 ? 'Free' : '৳100'}</span>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-aurvion-gold">
                      ৳{(total >= 2000 ? total : total + 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {total < 2000 && (
                <p className="text-sm text-aurvion-gold mb-4">
                  Add ৳{(2000 - total).toLocaleString()} more for free delivery!
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-3 py-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
