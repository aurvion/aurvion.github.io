import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, Users, TrendingUp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check if Firebase is configured
        if (!db) {
          console.log('Firebase not configured, using demo stats');
          throw new Error('Firebase not available');
        }

        // Fetch products count
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        // Fetch orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const totalOrders = orders.length;
        const pendingOrders = orders.filter((o) => o.status === 'pending').length;
        
        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
          .slice(0, 5);

        setStats({
          totalProducts: totalProducts || 8,
          totalOrders: totalOrders || 0,
          pendingOrders: pendingOrders || 0,
          recentOrders,
        });
      } catch (error) {
        console.log('Using demo stats:', error.message);
        // Demo data
        setStats({
          totalProducts: 8,
          totalOrders: 0,
          pendingOrders: 0,
          recentOrders: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-500',
      confirmed: 'bg-blue-500/20 text-blue-500',
      packed: 'bg-purple-500/20 text-purple-500',
      delivered: 'bg-green-500/20 text-green-500',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-aurvion-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aurvion-black">
      {/* Header */}
      <header className="bg-aurvion-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-gold-gradient">
                AURVION Admin
              </h1>
              <p className="text-gray-400 text-sm">Welcome back, {user?.email || 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-4 bg-aurvion-gold/10 border border-aurvion-gold rounded-xl text-left"
          >
            <TrendingUp className="w-6 h-6 text-aurvion-gold mb-2" />
            <p className="text-white font-medium">Dashboard</p>
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            className="p-4 bg-aurvion-dark border border-gray-800 rounded-xl text-left hover:border-aurvion-gold transition-colors"
          >
            <Package className="w-6 h-6 text-aurvion-gold mb-2" />
            <p className="text-white font-medium">Products</p>
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-4 bg-aurvion-dark border border-gray-800 rounded-xl text-left hover:border-aurvion-gold transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-aurvion-gold mb-2" />
            <p className="text-white font-medium">Orders</p>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-aurvion-dark rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-aurvion-gold/10 rounded-lg">
                <Package className="w-6 h-6 text-aurvion-gold" />
              </div>
            </div>
          </div>

          <div className="bg-aurvion-dark rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-aurvion-dark rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-aurvion-dark rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-aurvion-black">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm font-medium">Order ID</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm font-medium">Customer</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm font-medium">Total</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm font-medium">Status</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-aurvion-black/50">
                      <td className="px-6 py-4 text-white font-mono text-sm">
                        #{order.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {order.customerInfo?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-aurvion-gold font-medium">
                        ৳{order.total?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {order.createdAt?.toDate?.().toLocaleDateString('en-BD') || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-gray-800 text-center">
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-aurvion-gold hover:text-aurvion-gold-light text-sm"
            >
              View All Orders →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
