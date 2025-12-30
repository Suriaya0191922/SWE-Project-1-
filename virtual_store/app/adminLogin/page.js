'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaChartLine, FaUsers, FaStore, FaBox, FaCheckCircle, 
  FaEnvelope, FaSearch, FaTrash, FaBars, FaTimes, FaLock 
} from 'react-icons/fa';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  // --- DASHBOARD STATES ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [buyerSearch, setBuyerSearch] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // 1. Persist login state
  useEffect(() => {
    const auth = localStorage.getItem("isAdminAuthenticated");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  // 2. Auth Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      localStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
    } else {
      setLoginError("Invalid Admin Key");
      setAdminPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    router.push("/");
  };

  // --- DATA SETS (Simplified for example) ---
  const todaySoldItems = [
    { product: 'Physics Textbook', seller: 'Rahim Khan', buyer: 'Tasnim Ahmed', time: '10:30 AM' },
    { product: 'Laptop Bag', seller: 'Sadia Jahan', buyer: 'Fahim Hossain', time: '11:15 AM' }
  ];

  const buyers = [
    { name: 'Tasnim Ahmed', id: '2001001', dept: 'CSE', joinDate: '2024-01-15', status: 'Active' },
    { name: 'Fahim Hossain', id: '2001002', dept: 'EEE', joinDate: '2024-02-20', status: 'Active' }
  ];

  // --- LOGIC ---
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigateTo = (section) => { 
    if(section === 'logout') handleLogout();
    else { setActiveSection(section); setSidebarOpen(false); }
  };

  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-bold inline-block';
    return status === 'Active' ? `${base} bg-green-200 text-green-800` : `${base} bg-yellow-200 text-yellow-800`;
  };

  // --- VIEW RENDERER ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-blue-900/40 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-purple-400 to-green-400 p-4 rounded-2xl mb-4">
              <FaLock className="text-3xl text-blue-950" />
            </div>
            <h1 className="text-3xl font-bold text-purple-100">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Enter admin123"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-5 py-4 bg-blue-950/50 border border-purple-500/30 rounded-2xl text-white outline-none focus:ring-2 focus:ring-green-400"
            />
            {loginError && <p className="text-red-400 text-center text-sm">{loginError}</p>}
            <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-green-500 text-white font-bold rounded-2xl transition-transform active:scale-95">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#c4dced" }}>
      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-screen w-64 bg-blue-900 text-white p-6 z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <h2 className="text-2xl font-bold text-lime-300 mb-10">Thrift Admin</h2>
        <nav className="space-y-2">
          {['dashboard', 'buyers', 'sellers', 'products', 'sold', 'messages', 'logout'].map((item) => (
            <button
              key={item}
              onClick={() => navigateTo(item)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 capitalize ${activeSection === item ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
            >
              {item === 'dashboard' && <FaChartLine />}
              {item === 'buyers' && <FaUsers />}
              {item === 'logout' && <FaTimes />}
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-0 pt-20 lg:pt-6">
        <button onClick={toggleSidebar} className="fixed top-5 left-5 z-50 p-3 bg-white text-blue-600 rounded-lg lg:hidden">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-blue-800 text-white p-8 rounded-lg">
              <h1 className="text-3xl font-bold">System Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Products" val="128 items" color="bg-green-200" />
              <StatCard title="Active Users" val="450" color="bg-purple-200" />
              <StatCard title="New Orders" val="12" color="bg-green-100" />
              <StatCard title="Messages" val="5" color="bg-purple-100" />
            </div>
          </div>
        )}

        {/* Other sections follow your previous component logic */}
      </main>
    </div>
  );
}

function StatCard({ title, val, color }) {
  return (
    <div className={`${color} p-6 rounded-lg shadow-md`}>
      <h3 className="text-blue-800 text-sm font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-900">{val}</p>
    </div>
  );
}