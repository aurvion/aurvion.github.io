# Aurvion - Premium Men's Watches E-Commerce

A modern, full-featured e-commerce website for a watch brand built with React, Vite, Tailwind CSS, and Firebase.

## Tech Stack

- **Frontend:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Icons:** Lucide React

## Features

### Customer Features
- Homepage with hero banner and featured products
- Shop page with search and price filtering
- Product detail pages with add to cart
- Shopping cart with quantity management
- Checkout with multiple payment options (COD, bKash, Nagad, Rocket)
- WhatsApp integration for order confirmation

### Admin Features
- Secure login with Firebase Authentication
- Dashboard with order and product statistics
- Product management (add, edit, delete)
- Order management with status updates
- Order tracking (Pending → Confirmed → Packed → Delivered)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd aurvion
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Get your Firebase config from Project Settings
   - Update `src/firebase.js` with your config

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Firebase Setup

### Authentication Setup
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Create an admin user manually in the Authentication section

### Firestore Database Setup
Create two collections:

**Collection: `products`**
```javascript
{
  name: string,
  price: number,
  sku: string,
  description: string,
  image: string (URL)
}
```

**Collection: `orders`**
```javascript
{
  items: array,
  subtotal: number,
  deliveryCharge: number,
  total: number,
  customerInfo: {
    name: string,
    phone: string,
    address: string
  },
  paymentMethod: string,
  paymentDetails: object | null,
  status: string,
  createdAt: timestamp
}
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables
Set these environment variables in Vercel:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── LoadingSpinner.jsx
│   └── Layout.jsx
├── pages/             # Page components
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   └── Checkout.jsx
├── context/           # React contexts
│   ├── CartContext.jsx
│   └── AuthContext.jsx
├── admin/             # Admin panel
│   ├── AdminLogin.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AdminOrders.jsx
│   └── ProtectedRoute.jsx
├── firebase.js        # Firebase configuration
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Payment Information

- **Payment Number:** 01850711725
- **WhatsApp Number:** 01850711725
- **Supported Methods:** Cash on Delivery, bKash, Nagad, Rocket

## License

MIT License - feel free to use this for your own projects.

## Support

For support, contact: support@aurvion.com
