"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaChartLine, FaUsers, FaStore, FaBox, FaCheckCircle, 
  FaEnvelope, FaSearch, FaTrash, FaBars, FaTimes, FaLock 
} from 'react-icons/fa';

export default function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  // SIDEBAR & SECTION STATES
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // SEARCH STATES
  const [buyerSearch, setBuyerSearch] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // 1. Persist Authentication
  useEffect(() => {
    const auth = localStorage.getItem("isAdminAuthenticated");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      localStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError("Incorrect Admin Password");
      setAdminPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    router.push("/");
  };

  // --- SAMPLE DATA ---
  const todaySoldItems = [
    { product: 'Physics Textbook', seller: 'Rahim Khan', buyer: 'Tasnim Ahmed', time: '10:30 AM' },
    { product: 'Laptop Bag', seller: 'Sadia Jahan', buyer: 'Fahim Hossain', time: '11:15 AM' },
    { product: 'Calculator', seller: 'Mehedi Hasan', buyer: 'Nusrat Ali', time: '2:00 PM' }
  ];

  const buyers = [
    { name: 'Tasnim Ahmed', id: '2001001', dept: 'CSE', joinDate: '2024-01-15', status: 'Active' },
    { name: 'Fahim Hossain', id: '2001002', dept: 'EEE', joinDate: '2024-02-20', status: 'Active' },
    { name: 'Nusrat Ali', id: '2001003', dept: 'CIVIL', joinDate: '2024-03-10', status: 'Active' },
    { name: 'Mahmud Reza', id: '2001004', dept: 'MECH', joinDate: '2024-01-25', status: 'Pending' }
  ];

  const sellers = [
    { name: 'Rahim Khan', id: '1901005', dept: 'CSE', listed: 12, sold: 8, status: 'Active' },
    { name: 'Sadia Jahan', id: '1901006', dept: 'EEE', listed: 5, sold: 3, status: 'Active' },
    { name: 'Mehedi Hasan', id: '1901007', dept: 'ARCH', listed: 8, sold: 5, status: 'Active' },
    { name: 'Rumana Islam', id: '1901008', dept: 'BBA', listed: 3, sold: 1, status: 'Pending' }
  ];

  const products = [
    { name: 'Physics Textbook', category: 'Books', price: 350, seller: 'Rahim Khan', date: '2024-10-15', status: 'Active' },
    { name: 'Laptop Bag', category: 'Accessories', price: 800, seller: 'Sadia Jahan', date: '2024-10-20', status: 'Sold' },
    { name: 'Scientific Calculator', category: 'Electronics', price: 1200, seller: 'Mehedi Hasan', date: '2024-11-01', status: 'Active' }
  ];

  const allSoldItems = [
    { product: 'Laptop Bag', price: 800, seller: 'Sadia Jahan', buyer: 'Fahim Hossain', date: '2024-11-05' },
    { product: 'Chemistry Notes', price: 200, seller: 'Rahim Khan', buyer: 'Mahmud Reza', date: '2024-11-04' }
  ];

  const messages = [
    { user: 'Karim Uddin', message: 'How can I list my old books?', time: '1 hour ago' },
    { user: 'Fatema Akter', message: 'Payment issue with my order', time: '3 hours ago' }
  ];

  // --- RESTORED FILTERING LOGIC ---
  const filteredBuyers = useMemo(() => buyers.filter(b => 
    b.name.toLowerCase().includes(buyerSearch.toLowerCase()) || b.id.includes(buyerSearch)
  ), [buyerSearch]);

  const filteredSellers = useMemo(() => sellers.filter(s => 
    s.name.toLowerCase().includes(sellerSearch.toLowerCase()) || s.id.includes(sellerSearch)
  ), [sellerSearch]);

  const filteredProducts = useMemo(() => products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())
  ), [productSearch]);

  // --- ACTIONS ---
  const handleRemove = (type, id) => {
    if (confirm(`Are you sure you want to remove this ${type}?`)) {
      alert(`${type} removed successfully!`);
    }
  };

  const navigateTo = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-bold inline-block';
    if (status === 'Active') return `${base} bg-green-200 text-green-800`;
    if (status === 'Pending') return `${base} bg-yellow-200 text-yellow-800`;
    if (status === 'Sold') return `${base} bg-purple-200 text-purple-800`;
    return `${base} bg-gray-200 text-gray-800`;
  };

  const navItems = [
    { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { id: 'buyers', icon: <FaUsers />, label: 'Buyers' },
    { id: 'sellers', icon: <FaStore />, label: 'Sellers' },
    { id: 'products', icon: <FaBox />, label: 'Products' },
    { id: 'sold', icon: <FaCheckCircle />, label: 'Sold History' },
    { id: 'messages', icon: <FaEnvelope />, label: 'Messages' },
    { id: 'logout', icon: <FaTimes />, label: 'Logout' }
  ];

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-blue-900/40 backdrop-blur-xl border border-purple-500/30 p-8 rounded-3xl shadow-2xl z-10">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-purple-400 to-green-400 p-4 rounded-2xl mb-4">
              <FaLock className="text-3xl text-blue-950" />
            </div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Admin Gate</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Security Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-5 py-4 bg-blue-950/50 border border-purple-500/30 rounded-2xl text-white outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            {loginError && <p className="text-red-400 text-center text-sm font-medium">{loginError}</p>}
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-500 to-green-500 text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform">
              Enter Dashboard
            </button>
          </form>
          <Link href="/" className="block text-center mt-6 text-purple-300/50 hover:text-purple-300 text-sm">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#c4dcedff" }}>
      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-screen w-64 bg-blue-900 text-white p-6 z-40 transition-transform duration-300 shadow-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 mb-10 mt-16 lg:mt-0">
          <h2 className="text-2xl font-bold text-lime-300">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => item.id === 'logout' ? handleLogout() : navigateTo(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeSection === item.id ? 'bg-blue-800 text-white font-semibold' : 'hover:bg-blue-800 text-white'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Hamburger / Overlay */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-5 left-5 z-50 p-3 bg-white text-blue-600 rounded-lg lg:hidden shadow-lg">
        {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-0 pt-20 lg:pt-6 overflow-x-hidden relative z-10">
        
        {/* DASHBOARD OVERVIEW */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold uppercase">System Overview</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-200 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Products</h3><p className="text-3xl font-bold">{products.length}</p></div>
              <div className="bg-purple-200 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Sold</h3><p className="text-3xl font-bold">{allSoldItems.length}</p></div>
              <div className="bg-green-100 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Messages</h3><p className="text-3xl font-bold">{messages.length}</p></div>
              <div className="bg-purple-100 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Buyers</h3><p className="text-3xl font-bold">{buyers.length}</p></div>
            </div>

            <div style={{ backgroundColor: "#e9c2f6ff" }} className="rounded-lg shadow-lg overflow-hidden mt-8">
              <div className="p-4 bg-blue-800 text-lime-300 font-bold">Recent Activity</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-700 text-white text-left">
                    <tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Seller</th><th className="px-6 py-4">Buyer</th><th className="px-6 py-4">Time</th></tr>
                  </thead>
                  <tbody>
                    {todaySoldItems.map((item, i) => (
                      <tr key={i} className="border-b border-purple-200 hover:bg-white/40">
                        <td className="px-6 py-4">{item.product}</td>
                        <td className="px-6 py-4">{item.seller}</td>
                        <td className="px-6 py-4">{item.buyer}</td>
                        <td className="px-6 py-4">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BUYERS SECTION */}
        {activeSection === 'buyers' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaUsers /> Buyers Management</h1>
            </div>
            <div style={{ backgroundColor: "#eedcf5ff" }} className="rounded-lg shadow-lg p-6">
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search Buyers by name or ID..." value={buyerSearch} onChange={(e) => setBuyerSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-800 text-lime-300">
                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">ID</th><th className="px-6 py-4">Dept</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredBuyers.map((b, i) => (
                      <tr key={i} className="border-b hover:bg-blue-50">
                        <td className="px-6 py-4 font-medium">{b.name}</td>
                        <td className="px-6 py-4">{b.id}</td>
                        <td className="px-6 py-4">{b.dept}</td>
                        <td className="px-6 py-4"><span className={getStatusBadge(b.status)}>{b.status}</span></td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleRemove('buyer', b.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1 text-sm"><FaTrash /> Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SELLERS SECTION */}
        {activeSection === 'sellers' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaStore /> Sellers Management</h1>
            </div>
            <div style={{ backgroundColor: "#f6dff7ff" }} className="rounded-lg shadow-lg p-6">
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search Sellers by name or ID..." value={sellerSearch} onChange={(e) => setSellerSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-800 text-lime-300">
                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">ID</th><th className="px-6 py-4">Listed</th><th className="px-6 py-4">Sold</th><th className="px-6 py-4">Action</th></tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredSellers.map((s, i) => (
                      <tr key={i} className="border-b hover:bg-blue-50">
                        <td className="px-6 py-4 font-medium">{s.name}</td>
                        <td className="px-6 py-4">{s.id}</td>
                        <td className="px-6 py-4">{s.listed}</td>
                        <td className="px-6 py-4 font-bold">{s.sold}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleRemove('seller', s.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS SECTION */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaBox /> Inventory Control</h1>
            </div>
            <div style={{ backgroundColor: "#edd8f3ff" }} className="rounded-lg shadow-lg p-6">
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search Products or Categories..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-800 text-lime-300">
                    <tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Seller</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredProducts.map((p, i) => (
                      <tr key={i} className="border-b hover:bg-blue-50">
                        <td className="px-6 py-4">{p.name}</td>
                        <td className="px-6 py-4 font-bold">৳{p.price}</td>
                        <td className="px-6 py-4">{p.seller}</td>
                        <td className="px-6 py-4"><span className={getStatusBadge(p.status)}>{p.status}</span></td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleRemove('product', i)} className="text-red-500"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SOLD ITEMS HISTORY */}
        {activeSection === 'sold' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaCheckCircle /> Sales History</h1>
            </div>
            <div style={{ backgroundColor: "#eecbf8ff" }} className="rounded-lg shadow-lg p-6">
              <table className="w-full text-left">
                <thead className="bg-blue-800 text-lime-300">
                  <tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Seller</th><th className="px-6 py-4">Buyer</th><th className="px-6 py-4">Date</th></tr>
                </thead>
                <tbody className="bg-white">
                  {allSoldItems.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-6 py-4">{item.product}</td>
                      <td className="px-6 py-4 font-bold">৳{item.price}</td>
                      <td className="px-6 py-4">{item.seller}</td>
                      <td className="px-6 py-4">{item.buyer}</td>
                      <td className="px-6 py-4 text-sm">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MESSAGES SECTION */}
        {activeSection === 'messages' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaEnvelope /> Inbox</h1>
            </div>
            <div style={{ backgroundColor: "#eecbf2ff" }} className="rounded-lg shadow-lg p-6 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className="p-5 border-l-4 rounded-lg bg-white border-purple-600 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 font-bold text-gray-800"><FaEnvelope className="text-purple-600" /> {msg.user}</div>
                  <p className="text-sm text-gray-700 ml-7">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2 ml-7">{msg.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}