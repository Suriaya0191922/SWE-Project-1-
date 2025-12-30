"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaChartLine, FaUsers, FaStore, FaBox, FaCheckCircle, 
  FaEnvelope, FaSearch, FaTrash, FaBars, FaTimes, FaLock, FaBell 
} from 'react-icons/fa';
// Dynamic Graph er jonno Recharts import kora holo
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  // API DATA STATES
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [soldHistory, setSoldHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // SIDEBAR & SECTION STATES
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // SEARCH STATES
  const [buyerSearch, setBuyerSearch] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // GRAPH DATA LOGIC
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const stats = months.map(m => ({ name: m, revenue: 0 }));

    soldHistory.forEach(item => {
      const date = new Date(item.order?.createdAt || new Date());
      const monthIndex = date.getMonth();
      stats[monthIndex].revenue += item.price || 0;
    });

    return stats;
  }, [soldHistory]);

  useEffect(() => {
    const auth = localStorage.getItem("isAdminAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      
      const [resB, resS, resP, resSold, resN] = await Promise.all([
        fetch("http://localhost:5000/api/admin/buyers", { headers }),
        fetch("http://localhost:5000/api/admin/sellers", { headers }),
        fetch("http://localhost:5000/api/admin/products", { headers }),
        fetch("http://localhost:5000/api/admin/sold-items", { headers }),
        fetch("http://localhost:5000/api/admin/notifications", { headers })
      ]);

      if (resB.ok) setBuyers(await resB.json());
      if (resS.ok) setSellers(await resS.json());
      if (resP.ok) setProducts(await resP.json());
      if (resSold.ok) setSoldHistory(await resSold.json());
      if (resN.ok) setNotifications(await resN.json());
      
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
      setLoginError("");
      fetchAllData(); 
    } catch (err) {
      setLoginError("Server error");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) fetchAllData(); 
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleRemove = async (type, id) => {
    if (!confirm(`Are you sure you want to remove this ${type}?`)) return;
    const token = localStorage.getItem("adminToken");
    const endpoint = type === 'product' ? `products/${id}` : 
                     type === 'notification' ? `notifications/${id}` : `${type}s/${id}`;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        alert(`${type} removed successfully!`);
        fetchAllData(); 
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    router.push("/");
  };

  const filteredBuyers = useMemo(() => buyers.filter(b => 
    b.name.toLowerCase().includes(buyerSearch.toLowerCase()) || String(b.id).includes(buyerSearch)
  ), [buyerSearch, buyers]);

  const filteredSellers = useMemo(() => sellers.filter(s => 
    s.name.toLowerCase().includes(sellerSearch.toLowerCase()) || String(s.id).includes(sellerSearch)
  ), [sellerSearch, sellers]);

  const filteredProducts = useMemo(() => products.filter(p => 
    p.productName.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase())
  ), [productSearch, products]);

  const navigateTo = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const navItems = [
    { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { id: 'buyers', icon: <FaUsers />, label: 'Buyers' },
    { id: 'sellers', icon: <FaStore />, label: 'Sellers' },
    { id: 'products', icon: <FaBox />, label: 'Products' },
    { id: 'sold', icon: <FaCheckCircle />, label: 'Sold History' },
    { id: 'notifications', icon: <FaBell />, label: 'Notification' },
    { id: 'logout', icon: <FaTimes />, label: 'Logout' }
  ];

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

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#c4dcedff" }}>
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-900 text-white rounded-xl shadow-lg"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

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
              {item.id === 'notifications' && notifications.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:ml-0 pt-20 lg:pt-6 overflow-x-hidden relative z-10">
        
        {/* DASHBOARD SECTION */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold uppercase">System Overview</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-200 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Products</h3><p className="text-3xl font-bold">{products.length}</p></div>
              <div className="bg-purple-200 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Sold</h3><p className="text-3xl font-bold">{soldHistory.length}</p></div>
              <div className="bg-green-100 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Buyers</h3><p className="text-3xl font-bold">{buyers.length}</p></div>
              <div className="bg-purple-100 p-6 rounded-lg shadow-md"><h3 className="text-blue-800 text-sm font-bold">Sellers</h3><p className="text-3xl font-bold">{sellers.length}</p></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <FaChartLine className="text-blue-800" /> Revenue Growth (Yearly)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#1e40af" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS SECTION */}
        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaEnvelope /> Message Requests</h1>
              <p className="text-lime-300 text-sm mt-1">Direct inquiries sent by sellers from their dashboard.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {notifications.length === 0 ? (
                <div className="bg-white/50 p-10 rounded-xl text-center text-gray-500 border-2 border-dashed border-gray-300">No message requests found.</div>
              ) : (
                notifications.map((note) => (
                  <div key={note.id} className="bg-white p-6 rounded-xl shadow-md border-l-8 border-blue-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-blue-900 text-lg">{note.user?.name || "Unknown Seller"}</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">ID: {note.userId}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{note.user?.email}</p>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700">{note.message}</div>
                      <p className="text-[10px] text-gray-400 mt-2">Received on: {new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleRemove('notification', note.id)} className="bg-red-50 text-red-600 p-3 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm"><FaTrash /></button>
                  </div>
                ))
              )}
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
                <input type="text" placeholder="Search Buyers..." value={buyerSearch} onChange={(e) => setBuyerSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-800 text-lime-300">
                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Joined</th><th className="px-6 py-4">Action</th></tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredBuyers.map((b) => (
                      <tr key={b.id} className="border-b hover:bg-blue-50">
                        <td className="px-6 py-4 font-medium">{b.name}</td>
                        <td className="px-6 py-4">{b.email}</td>
                        <td className="px-6 py-4">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4"><button onClick={() => handleRemove('buyer', b.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1 text-sm"><FaTrash /> Remove</button></td>
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
                <input type="text" placeholder="Search Sellers..." value={sellerSearch} onChange={(e) => setSellerSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-800 text-lime-300">
                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Products Listed</th><th className="px-6 py-4">Action</th></tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredSellers.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-blue-50">
                        <td className="px-6 py-4 font-medium">{s.name}</td>
                        <td className="px-6 py-4 font-bold">{s._count?.products || 0}</td>
                        <td className="px-6 py-4"><button onClick={() => handleRemove('seller', s.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS SECTION (UPDATED STATUS LOGIC) */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaBox /> Inventory Control</h1>
            </div>
            <div style={{ backgroundColor: "#edd8f3ff" }} className="rounded-lg shadow-lg p-6">
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search Products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-800 text-lime-300">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Seller</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-blue-50">
                        <td className="px-6 py-4">{p.productName}</td>
                        <td className="px-6 py-4 font-bold">৳{p.price}</td>
                        <td className="px-6 py-4">
                          {p.status?.toLowerCase() === "sold" ? (
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200 uppercase">
                              Sold
                            </span>
                          ) : (
                            <select 
                              value={p.status || "active"} 
                              onChange={(e) => handleStatusChange(p.id, e.target.value)}
                              className="border rounded px-2 py-1 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="sold">Sold</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4">{p.seller?.name || "Unknown"}</td>
                        <td className="px-6 py-4"><button onClick={() => handleRemove('product', p.id)} className="text-red-500 hover:text-red-700 transition-colors"><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SOLD HISTORY SECTION */}
        {activeSection === 'sold' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold flex items-center gap-3"><FaCheckCircle /> Sales History</h1>
            </div>
            <div style={{ backgroundColor: "#eecbf8ff" }} className="rounded-lg shadow-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-800 text-lime-300">
                    <tr>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Buyer Name</th>
                      <th className="px-6 py-4">Buyer Email</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {soldHistory.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-blue-900">{item.product?.productName}</td>
                        <td className="px-6 py-4 font-bold text-green-600">৳{item.price}</td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{item.order?.buyer?.name || "N/A"}</td>
                        <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200">{item.order?.buyer?.email || "No Email"}</span></td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(item.order?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {soldHistory.length === 0 && <div className="text-center py-10 text-gray-500 italic">No sales recorded yet.</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}