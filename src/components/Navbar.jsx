import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-aurvion-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-display text-2xl font-bold text-gold-gradient">
              AURVION
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-aurvion-gold transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Admin Link */}
            {user && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden md:flex items-center text-gray-300 hover:text-aurvion-gold transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-gray-300 hover:text-aurvion-gold transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-aurvion-gold text-aurvion-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-aurvion-gold"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-aurvion-dark border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-gray-300 hover:text-aurvion-gold hover:bg-aurvion-black rounded-lg transition-all"
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  navigate('/admin');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-aurvion-gold hover:bg-aurvion-black rounded-lg transition-all"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
