import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, Wallet, Check, MessageCircle, AlertCircle, MapPin } from 'lucide-react';
import { getDivisions, getDistricts, getThanas } from '../data/bangladeshLocations';

// Payment number for bKash/Nagad/Rocket (Contact number)
const PAYMENT_NUMBER = '01850711725';
// WhatsApp number for order messages
const WHATSAPP_NUMBER = '8801586094280';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Check if this is a "Buy Now" checkout
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

  // Address state - ALL declared together at top to prevent re-render issues
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedThana, setSelectedThana] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'cod',
    senderNumber: '',
    transactionId: '',
  });

  const [errors, setErrors] = useState({});

  // Initialize checkout items (cart or buy now)
  useEffect(() => {
    const buyNowItem = sessionStorage.getItem('buyNowItem');
    if (buyNowItem) {
      const item = JSON.parse(buyNowItem);
      setCheckoutItems([item]);
      setIsBuyNow(true);
    } else {
      setCheckoutItems(cartItems);
      setIsBuyNow(false);
    }
  }, [cartItems]);

  // Calculate totals
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Smart delivery charge calculation based on location
  const calculateDeliveryCharge = () => {
    // If no district selected yet, return default
    if (!selectedDistrict) return 150;
    
    // Kishoreganj district = 60 BDT
    if (selectedDistrict === 'Kishoreganj') return 60;
    
    // Dhaka district with city thanas = 120 BDT
    if (selectedDistrict === 'Dhaka') {
      const dhakaCityThanas = [
        'Adabor', 'Badda', 'Bangshal', 'Bimanbandar', 'Cantonment', 'Chawkbazar',
        'Dakshinkhan', 'Darus Salam', 'Demra', 'Dhanmondi', 'Gendaria', 'Gulshan',
        'Hazaribagh', 'Jatrabari', 'Kadamtali', 'Kafrul', 'Kalabagan', 'Kamrangirchar',
        'Khilgaon', 'Khilkhet', 'Kotwali', 'Lalbagh', 'Mirpur', 'Mohammadpur',
        'Motijheel', 'New Market', 'Pallabi', 'Paltan', 'Ramna', 'Rampura',
        'Sabujbagh', 'Shah Ali', 'Shahbagh', 'Shyampur', 'Sher-e-Bangla Nagar',
        'Sutrapur', 'Tejgaon', 'Tejgaon Industrial Area', 'Turag', 'Uttara',
        'Uttar Khan', 'Vatara', 'Wari'
      ];
      
      if (selectedThana && dhakaCityThanas.includes(selectedThana)) {
        return 120;
      }
      // Dhaka district but outside city (Dhamrai, Dohar, Keraniganj, etc.) = 150 BDT
      return 150;
    }
    
    // All other districts = 150 BDT
    return 150;
  };
  
  const deliveryCharge = calculateDeliveryCharge();
  const finalTotal = subtotal + deliveryCharge;

  // Get available options
  const divisions = getDivisions();
  const districts = getDistricts(selectedDivision);
  const thanas = getThanas(selectedDivision, selectedDistrict);

  // Generate full address preview - use useMemo to prevent recalculation on every render
  const fullAddress = (() => {
    if (!detailedAddress || !selectedThana || !selectedDistrict || !selectedDivision) return '';
    return `${detailedAddress}, ${selectedThana}, ${selectedDistrict}, ${selectedDivision}`;
  })();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Bangladeshi phone number (e.g., 01712345678)';
    }
    if (!selectedDivision) newErrors.division = 'Division is required';
    if (!selectedDistrict) newErrors.district = 'District is required';
    if (!selectedThana) newErrors.thana = 'Thana/Upazila is required';
    if (!detailedAddress.trim()) newErrors.detailedAddress = 'Detailed address is required';
    
    if (formData.paymentMethod !== 'cod') {
      if (!formData.senderNumber.trim()) {
        newErrors.senderNumber = 'Sender number is required';
      }
      if (!formData.transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle division change
  const handleDivisionChange = (e) => {
    const division = e.target.value;
    setSelectedDivision(division);
    setSelectedDistrict('');
    setSelectedThana('');
    if (errors.division) setErrors(prev => ({ ...prev, division: null }));
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedThana('');
    if (errors.district) setErrors(prev => ({ ...prev, district: null }));
  };

  // Handle thana change
  const handleThanaChange = (e) => {
    setSelectedThana(e.target.value);
    if (errors.thana) setErrors(prev => ({ ...prev, thana: null }));
  };

  const generateWhatsAppMessage = (orderData, orderId) => {
    const items = checkoutItems.map(item => 
      `• ${item.name} (${item.sku || 'N/A'}) - ৳${item.price.toLocaleString()} x ${item.quantity}`
    ).join('\n');

    const address = `${orderData.detailedAddress}, ${orderData.thana}, ${orderData.district}, ${orderData.division}`;

    let message = `🛒 *New Order from Aurvion*\n\n`;
    message += `📋 *Order ID:* ${orderId}\n\n`;
    message += `👤 *Customer Info:*\n`;
    message += `Name: ${orderData.name}\n`;
    message += `Phone: ${orderData.phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `📦 *Order Items:*\n${items}\n\n`;
    message += `💰 *Payment Details:*\n`;
    message += `Subtotal: ৳${subtotal.toLocaleString()}\n`;
    message += `Delivery: ৳${deliveryCharge === 0 ? 'Free' : deliveryCharge.toLocaleString()}\n`;
    message += `*Total: ৳${finalTotal.toLocaleString()}*\n\n`;
    message += `💳 *Payment Method:* ${orderData.paymentMethod.toUpperCase()}\n`;
    
    if (orderData.paymentMethod !== 'cod') {
      message += `Sender Number: ${orderData.senderNumber}\n`;
      message += `Transaction ID: ${orderData.transactionId}\n`;
    }
    
    message += `\n⏰ *Order Time:* ${new Date().toLocaleString('en-BD')}`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: checkoutItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sku: item.sku || 'N/A',
        })),
        subtotal,
        deliveryCharge,
        total: finalTotal,
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          division: selectedDivision,
          district: selectedDistrict,
          thana: selectedThana,
          detailedAddress: detailedAddress,
          fullAddress: fullAddress,
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'cod' ? null : {
          senderNumber: formData.senderNumber,
          transactionId: formData.transactionId,
        },
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      let docRef = null;
      
      // Try to save to Firebase if available
      if (db) {
        try {
          docRef = await addDoc(collection(db, 'orders'), orderData);
          console.log('Order saved to Firebase:', docRef.id);
        } catch (firebaseError) {
          console.warn('Firebase save failed, using local order ID:', firebaseError);
          docRef = { id: 'ORD-' + Date.now() };
        }
      } else {
        // Generate local order ID if Firebase not available
        docRef = { id: 'ORD-' + Date.now() };
        console.log('Firebase not available, order ID:', docRef.id);
      }
      
      setOrderId(docRef.id);

      // Open WhatsApp with order details
      const whatsappMessage = generateWhatsAppMessage({
        ...formData,
        division: selectedDivision,
        district: selectedDistrict,
        thana: selectedThana,
        detailedAddress
      }, docRef.id);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');

      // Clear buy now session if applicable
      if (isBuyNow) {
        sessionStorage.removeItem('buyNowItem');
      } else {
        // Only clear cart if not buy now
        clearCart();
      }
      
      setOrderSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDetailedAddressChange = (e) => {
    setDetailedAddress(e.target.value);
    if (errors.detailedAddress) {
      setErrors(prev => ({ ...prev, detailedAddress: null }));
    }
  };

  if (checkoutItems.length === 0 && !orderSuccess) {
    navigate('/shop');
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="pt-20 min-h-screen bg-aurvion-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-400 mb-4">
            Your order ID: <span className="text-aurvion-gold font-mono">{orderId}</span>
          </p>
          <p className="text-gray-400 mb-6">
            We've opened WhatsApp with your order details. Please send the message to confirm your order.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
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
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-aurvion-dark rounded-xl p-6 border border-gray-800">
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-aurvion-black border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurvion-gold transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-800'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-aurvion-black border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurvion-gold transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-800'
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Division Dropdown */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Division *
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className={`w-full px-4 py-3 bg-aurvion-black border rounded-lg text-white focus:outline-none focus:border-aurvion-gold transition-colors ${
                      errors.division ? 'border-red-500' : 'border-gray-800'
                    }`}
                  >
                    <option value="">Select Division</option>
                    {divisions.map(division => (
                      <option key={division} value={division}>{division}</option>
                    ))}
                  </select>
                  {errors.division && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.division}
                    </p>
                  )}
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    District *
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedDivision}
                    className={`w-full px-4 py-3 bg-aurvion-black border rounded-lg text-white focus:outline-none focus:border-aurvion-gold transition-colors ${
                      errors.district ? 'border-red-500' : 'border-gray-800'
                    } ${!selectedDivision ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">{selectedDivision ? 'Select District' : 'First select Division'}</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* Thana/Upazila Dropdown */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Thana / Upazila *
                  </label>
                  <select
                    value={selectedThana}
                    onChange={handleThanaChange}
                    disabled={!selectedDistrict}
                    className={`w-full px-4 py-3 bg-aurvion-black border rounded-lg text-white focus:outline-none focus:border-aurvion-gold transition-colors ${
                      errors.thana ? 'border-red-500' : 'border-gray-800'
                    } ${!selectedDistrict ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">{selectedDistrict ? 'Select Thana' : 'First select District'}</option>
                    {thanas.map(thana => (
                      <option key={thana} value={thana}>{thana}</option>
                    ))}
                  </select>
                  {errors.thana && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.thana}
                    </p>
                  )}
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Detailed Address (House, Road, Area) *
                  </label>
                  <textarea
                    value={detailedAddress}
                    onChange={handleDetailedAddressChange}
                    rows={2}
                    className={`w-full px-4 py-3 bg-aurvion-black border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurvion-gold transition-colors resize-none ${
                      errors.detailedAddress ? 'border-red-500' : 'border-gray-800'
                    }`}
                    placeholder="e.g., House 12, Road 5, Dhanmondi"
                  />
                  {errors.detailedAddress && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.detailedAddress}
                    </p>
                  )}
                </div>

                {/* Address Preview */}
                {fullAddress && (
                  <div className="p-3 bg-aurvion-gold/10 border border-aurvion-gold/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-5 h-5 text-aurvion-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-aurvion-gold text-sm font-medium mb-1">Delivery Address:</p>
                        <p className="text-white text-sm">{fullAddress}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Charge Indicator */}
                {selectedDistrict && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">
                          Delivery to {selectedDistrict}:
                        </span>
                      </div>
                      <span className="text-aurvion-gold font-bold">
                        {deliveryCharge === 0 ? 'FREE' : `৳${deliveryCharge}`}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 ml-7">
                      {selectedDistrict === 'Kishoreganj' && 'Special rate for Kishoreganj'}
                      {selectedDistrict === 'Dhaka' && selectedThana && deliveryCharge === 120 && 'Dhaka City delivery'}
                      {selectedDistrict === 'Dhaka' && selectedThana && deliveryCharge === 150 && 'Outside Dhaka City'}
                      {selectedDistrict !== 'Kishoreganj' && selectedDistrict !== 'Dhaka' && 'Standard delivery charge'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-aurvion-dark rounded-xl p-6 border border-gray-800">
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-aurvion-gold bg-aurvion-gold/10' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Truck className="w-6 h-6 text-aurvion-gold mr-3" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Cash on Delivery</p>
                    <p className="text-gray-400 text-sm">Pay when you receive</p>
                  </div>
                  {formData.paymentMethod === 'cod' && (
                    <div className="w-5 h-5 rounded-full bg-aurvion-gold flex items-center justify-center">
                      <div className="w-2 h-2 bg-aurvion-black rounded-full" />
                    </div>
                  )}
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'bkash' 
                    ? 'border-aurvion-gold bg-aurvion-gold/10' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={formData.paymentMethod === 'bkash'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Wallet className="w-6 h-6 text-aurvion-gold mr-3" />
                  <div className="flex-1">
                    <p className="text-white font-medium">bKash</p>
                    <p className="text-gray-400 text-sm">Send money to {PAYMENT_NUMBER}</p>
                  </div>
                  {formData.paymentMethod === 'bkash' && (
                    <div className="w-5 h-5 rounded-full bg-aurvion-gold flex items-center justify-center">
                      <div className="w-2 h-2 bg-aurvion-black rounded-full" />
                    </div>
                  )}
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'nagad' 
                    ? 'border-aurvion-gold bg-aurvion-gold/10' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={formData.paymentMethod === 'nagad'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <CreditCard className="w-6 h-6 text-aurvion-gold mr-3" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Nagad</p>
                    <p className="text-gray-400 text-sm">Send money to {PAYMENT_NUMBER}</p>
                  </div>
                  {formData.paymentMethod === 'nagad' && (
                    <div className="w-5 h-5 rounded-full bg-aurvion-gold flex items-center justify-center">
                      <div className="w-2 h-2 bg-aurvion-black rounded-full" />
                    </div>
                  )}
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'rocket' 
                    ? 'border-aurvion-gold bg-aurvion-gold/10' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="rocket"
                    checked={formData.paymentMethod === 'rocket'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Wallet className="w-6 h-6 text-aurvion-gold mr-3" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Rocket</p>
                    <p className="text-gray-400 text-sm">Send money to {PAYMENT_NUMBER}</p>
                  </div>
                  {formData.paymentMethod === 'rocket' && (
                    <div className="w-5 h-5 rounded-full bg-aurvion-gold flex items-center justify-center">
                      <div className="w-2 h-2 bg-aurvion-black rounded-full" />
                    </div>
                  )}
                </label>
              </div>

              {/* Online Payment Details */}
              {formData.paymentMethod !== 'cod' && (
                <div className="mt-4 p-4 bg-aurvion-black rounded-lg border border-gray-800 space-y-4">
                  <div className="flex items-center space-x-2 text-aurvion-gold">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Payment Number: {PAYMENT_NUMBER}</span>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Sender Number *
                    </label>
                    <input
                      type="tel"
                      name="senderNumber"
                      value={formData.senderNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-aurvion-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurvion-gold transition-colors ${
                        errors.senderNumber ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.senderNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.senderNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Transaction ID *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-aurvion-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurvion-gold transition-colors ${
                        errors.transactionId ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter transaction ID"
                    />
                    {errors.transactionId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.transactionId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-aurvion-dark rounded-xl p-6 border border-gray-800 sticky top-24">
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ৳{item.price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-aurvion-gold font-medium">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({checkoutItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? 'Free' : `৳${deliveryCharge.toLocaleString()}`}</span>
                </div>
                <div className="border-t border-gray-800 pt-2">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-aurvion-gold">
                      ৳{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-aurvion-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  `Place Order - ৳${finalTotal.toLocaleString()}`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
