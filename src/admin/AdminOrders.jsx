import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_OPTIONS = ['pending', 'confirmed', 'packed', 'delivered'];

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      if (!db) {
        console.log('Firebase not configured');
        throw new Error('Firebase not available');
      }
      const snapshot = await getDocs(collection(db, 'orders'));
      const ordersData = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(ordersData);
    } catch (e) {
      console.log('Orders fetch failed:', e.message);
      setOrders([]);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    if (!db) {
      alert('Firebase not configured - cannot update status');
      return;
    }
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      fetchOrders();
    } catch (e) {
      alert('Error updating status');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (s) => ({
    pending: 'bg-yellow-500/20 text-yellow-500',
    confirmed: 'bg-blue-500/20 text-blue-500',
    packed: 'bg-purple-500/20 text-purple-500',
    delivered: 'bg-green-500/20 text-green-500',
  }[s] || 'bg-gray-500/20 text-gray-500');

  if (loading) return <div className="min-h-screen bg-aurvion-black flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-aurvion-black">
      <header className="bg-aurvion-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-white flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="font-display text-xl font-bold text-gold-gradient">Orders</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === s ? 'bg-aurvion-gold text-aurvion-black' : 'bg-aurvion-dark text-gray-400 hover:text-white'}`}>
              {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-aurvion-dark rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-aurvion-black">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Order ID</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Customer</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Items</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Total</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Payment</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Date</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-aurvion-black/50">
                    <td className="px-4 py-4 text-white font-mono text-sm">#{o.id.slice(-6)}</td>
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">{o.customerInfo?.name}</p>
                      <p className="text-gray-400 text-sm">{o.customerInfo?.phone}</p>
                      <p className="text-gray-500 text-xs max-w-[200px]">
                        {o.customerInfo?.fullAddress || 
                         (o.customerInfo?.detailedAddress && o.customerInfo?.thana 
                           ? `${o.customerInfo.detailedAddress}, ${o.customerInfo.thana}, ${o.customerInfo.district}, ${o.customerInfo.division}`
                           : o.customerInfo?.address || 'N/A'
                         )}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {o.items?.map((item, i) => (
                          <div key={i} className="flex items-center bg-aurvion-black rounded px-2 py-1">
                            <img src={item.image} alt="" className="w-6 h-6 object-cover rounded mr-2" />
                            <span className="text-xs text-gray-400">{item.name} x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-aurvion-gold font-bold">৳{o.total?.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className="text-gray-400 text-sm capitalize">{o.paymentMethod}</span>
                      {o.paymentMethod !== 'cod' && o.paymentDetails && (
                        <div className="text-xs text-gray-500 mt-1">
                          TXN: {o.paymentDetails.transactionId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {o.createdAt?.toDate?.().toLocaleDateString('en-BD')}
                      <br />
                      {o.createdAt?.toDate?.().toLocaleTimeString('en-BD')}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={o.status || 'pending'}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border-0 cursor-pointer ${getStatusColor(o.status)}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-aurvion-dark text-white">{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-400">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
