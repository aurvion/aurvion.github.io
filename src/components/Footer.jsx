import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-aurvion-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-gold-gradient mb-4">
              AURVION
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Premium men's watches for the modern gentleman. 
              Timeless elegance meets contemporary style.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-aurvion-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-aurvion-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/8801586094280"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-aurvion-gold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-aurvion-gold transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-aurvion-gold transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-aurvion-gold transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Shipping Info</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Returns & Exchanges</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">FAQ</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Size Guide</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-aurvion-gold" />
                <a 
                  href="tel:01850711725" 
                  className="text-gray-400 text-sm hover:text-aurvion-gold transition-colors"
                >
                  01850711725
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-aurvion-gold" />
                <span className="text-gray-400 text-sm">aurvionbusiness@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-aurvion-gold mt-0.5" />
                <span className="text-gray-400 text-sm">Kuliarchar, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Aurvion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
