import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', sku: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      if (!db) {
        console.log('Firebase not configured, using demo data');
        throw new Error('Firebase not available');
      }
      const snapshot = await getDocs(collection(db, 'products'));
      const productsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (productsData.length === 0) {
        throw new Error('No products in database');
      }
      setProducts(productsData);
    } catch (e) {
      console.log('Using demo products:', e.message);
      setProducts([
        { id: '1', name: 'Classic Black Watch', price: 1200, sku: 'AUR-001', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', description: 'Elegant black dial with genuine leather strap. Perfect for formal occasions and everyday wear.' },
        { id: '2', name: 'Luxury Gold Watch', price: 3500, sku: 'AUR-002', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200', description: 'Premium gold-plated case with champagne dial. Sophisticated design for the modern gentleman.' },
        { id: '3', name: 'Sport Digital Watch', price: 999, sku: 'AUR-003', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=200', description: 'Multi-function digital display with stopwatch, alarm, and backlight. Durable rubber strap.' },
        { id: '4', name: 'Minimalist Silver', price: 1500, sku: 'AUR-004', image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=200', description: 'Ultra-thin silver case with clean white dial. Mesh stainless steel band.' },
        { id: '5', name: 'Chronograph Pro', price: 2800, sku: 'AUR-005', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200', description: 'Precision chronograph with three sub-dials and date window. Stainless steel bracelet.' },
        { id: '6', name: 'Rose Gold Elite', price: 3200, sku: 'AUR-006', image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=200', description: 'Stunning rose gold finish with brown leather strap. Sapphire crystal glass.' },
        { id: '7', name: 'Youth Casual Watch', price: 850, sku: 'AUR-007', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200', description: 'Trendy and affordable timepiece for young professionals. Colorful nylon strap.' },
        { id: '8', name: 'Executive Automatic', price: 4500, sku: 'AUR-008', image: 'https://images.unsplash.com/photo-1434056886845-dbe89f8f5f3d?w=200', description: 'Self-winding automatic movement with transparent case back. Premium alligator leather strap.' },
      ]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) {
      alert('Firebase not configured - cannot save products in demo mode');
      return;
    }
    const data = { ...formData, price: Number(formData.price) };
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
      } else {
        await addDoc(collection(db, 'products'), data);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', sku: '', description: '', image: '' });
      fetchProducts();
    } catch (e) {
      alert('Error saving product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    if (!db) {
      alert('Firebase not configured - cannot delete products in demo mode');
      return;
    }
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (e) {
      alert('Error deleting product.');
    }
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setFormData({ name: p.name, price: p.price, sku: p.sku || '', description: p.description || '', image: p.image || '' });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', sku: '', description: '', image: '' });
    setShowModal(true);
  };

  if (loading) return <div className="min-h-screen bg-aurvion-black flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-aurvion-black">
      <header className="bg-aurvion-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-white flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="font-display text-xl font-bold text-gold-gradient">Products</h1>
          <button onClick={openAdd} className="btn-primary flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-aurvion-dark rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-aurvion-black">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 text-sm">Image</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm">Name</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm">SKU</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm">Price</th>
                <th className="px-4 py-3 text-right text-gray-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-aurvion-black/50">
                  <td className="px-4 py-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" onError={e => e.target.src = 'https://via.placeholder.com/50'} />
                  </td>
                  <td className="px-4 py-3 text-white">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.sku || 'N/A'}</td>
                  <td className="px-4 py-3 text-aurvion-gold">৳{p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-400 mr-3"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-aurvion-dark rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-gray-400 text-sm mb-1">Name *</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-aurvion-black border border-gray-800 rounded-lg text-white focus:border-aurvion-gold" /></div>
              <div><label className="block text-gray-400 text-sm mb-1">Price (BDT) *</label><input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-aurvion-black border border-gray-800 rounded-lg text-white focus:border-aurvion-gold" /></div>
              <div><label className="block text-gray-400 text-sm mb-1">SKU</label><input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2 bg-aurvion-black border border-gray-800 rounded-lg text-white focus:border-aurvion-gold" placeholder="AUR-001" /></div>
              <div><label className="block text-gray-400 text-sm mb-1">Image URL</label><input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 bg-aurvion-black border border-gray-800 rounded-lg text-white focus:border-aurvion-gold" placeholder="https://..." /></div>
              <div><label className="block text-gray-400 text-sm mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-aurvion-black border border-gray-800 rounded-lg text-white focus:border-aurvion-gold resize-none" /></div>
              <button type="submit" className="btn-primary w-full">{editingProduct ? 'Update Product' : 'Add Product'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
