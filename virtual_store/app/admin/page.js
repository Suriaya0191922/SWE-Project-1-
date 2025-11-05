"use client";

import { useState, useMemo } from 'react';
import { FaChartLine, FaUsers, FaStore, FaBox, FaCheckCircle, FaEnvelope, FaSearch, FaTrash, FaBars, FaTimes } from 'react-icons/fa';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [buyerSearch, setBuyerSearch] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sample Data
  const todaySoldItems = [
    { product: 'Physics Textbook', seller: 'Rahim Khan', buyer: 'Tasnim Ahmed', time: '10:30 AM' },
    { product: 'Laptop Bag', seller: 'Sadia Jahan', buyer: 'Fahim Hossain', time: '11:15 AM' },
    { product: 'Calculator', seller: 'Mehedi Hasan', buyer: 'Nusrat Ali', time: '2:00 PM' }
  ];

  const messages = [
    { user: 'Karim Uddin', message: 'How can I list my old books?', time: '1 hour ago' },
    { user: 'Fatema Akter', message: 'Payment issue with my last order', time: '3 hours ago' },
    { user: 'Rakib Hassan', message: 'Can I get delivery to my dorm?', time: '5 hours ago' }
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
    { name: 'Calculator', category: 'Electronics', price: 450, seller: 'Mehedi Hasan', date: '2024-10-25', status: 'Sold' },
    { name: 'Engineering Drawing Set', category: 'Supplies', price: 600, seller: 'Rumana Islam', date: '2024-11-01', status: 'Pending' }
  ];

  const allSoldItems = [
    { product: 'Laptop Bag', price: 800, seller: 'Sadia Jahan', buyer: 'Fahim Hossain', date: '2024-11-05' },
    { product: 'Calculator', price: 450, seller: 'Mehedi Hasan', buyer: 'Nusrat Ali', date: '2024-11-05' },
    { product: 'Chemistry Notes', price: 200, seller: 'Rahim Khan', buyer: 'Mahmud Reza', date: '2024-11-04' }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navigateTo = (section) => {
    setActiveSection(section);
    closeSidebar();
  };

  const handleSort = (key, type) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredBuyers = useMemo(() => {
    return buyers.filter(b => 
      b.name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.id.includes(buyerSearch)
    );
  }, [buyerSearch]);

  const filteredSellers = useMemo(() => {
    return sellers.filter(s => 
      s.name.toLowerCase().includes(sellerSearch.toLowerCase()) ||
      s.id.includes(sellerSearch)
    );
  }, [sellerSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch]);

  const handleRemove = (type, id) => {
    if (confirm(`Are you sure you want to remove this ${type}?`)) {
      alert(`${type} removed successfully!`);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-bold inline-block';
    if (status === 'Active') return `${baseClasses} bg-green-200 text-green-800`;
    if (status === 'Pending') return `${baseClasses} bg-yellow-200 text-yellow-800`;
    if (status === 'Sold') return `${baseClasses} bg-blue-200 text-purple-800`;
    return baseClasses;
  };

  const navItems = [
    { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { id: 'buyers', icon: <FaUsers />, label: 'Buyers' },
    { id: 'sellers', icon: <FaStore />, label: 'Sellers' },
    { id: 'products', icon: <FaBox />, label: 'Products' },
    { id: 'sold', icon: <FaCheckCircle />, label: 'Sold Items' },
    { id: 'messages', icon: <FaEnvelope />, label: 'Messages' }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-5 left-5 z-50 p-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg border border-blue-200"
      >
        {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 via-blue-500 to-green-500 text-white p-6 z-40 transition-transform duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 mb-10 mt-16">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <FaStore className="text-2xl text-green-300" />
          </div>
          <h2 className="text-xl font-bold text-green-300">Admin Panel</h2>
        </div>
        
        <nav className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeSection === item.id
                  ? 'bg-white/30 backdrop-blur-sm shadow-lg scale-105'
                  : 'hover:bg-white/20 hover:scale-105'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-0 pt-20 overflow-x-hidden">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
              <h1 className="text-3xl font-bold">Welcome Admin</h1>
              <p className="text-purple-100 mt-2">CUET Thrift Store Dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-purple-200 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-600 text-sm font-semibold">Items Sold Today</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">5</p>
                  </div>
                  <FaCheckCircle className="text-4xl text-green-500" />
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-200 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-600 text-sm font-semibold">Items Added Today</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
                  </div>
                  <FaBox className="text-4xl text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-green-200 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-600 text-sm font-semibold">Messages Received</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">3</p>
                  </div>
                  <FaEnvelope className="text-4xl text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
                <h2 className="text-xl text-white font-bold">Today's Sold Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Product</th>
                      <th className="px-6 py-4 text-left font-semibold">Seller</th>
                      <th className="px-6 py-4 text-left font-semibold">Buyer</th>
                      <th className="px-6 py-4 text-left font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaySoldItems.map((item, i) => (
                      <tr key={i} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{item.product}</td>
                        <td className="px-6 py-4 text-gray-600">{item.seller}</td>
                        <td className="px-6 py-4 text-gray-600">{item.buyer}</td>
                        <td className="px-6 py-4 text-gray-600">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 p-6">
              <h2 className="text-xl text-purple-900 font-bold mb-4">Recent Messages</h2>
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 border-l-4 border-purple-600 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <FaEnvelope className="text-purple-600" />
                      <p className="font-semibold text-gray-800">{msg.user}</p>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-2 ml-6">{msg.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buyers Section */}
        {activeSection === 'buyers' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaUsers /> Buyers Management
              </h1>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 p-6">
              <h2 className="text-xl text-purple-900 font-bold mb-4">Registered Buyers</h2>
              
              <div className="relative mb-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Buyers by name or ID"
                  value={buyerSearch}
                  onChange={(e) => setBuyerSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-white/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-purple-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Student ID</th>
                      <th className="px-6 py-4 text-left font-semibold">Department</th>
                      <th className="px-6 py-4 text-left font-semibold">Join Date</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredBuyers.map((buyer, i) => (
                      <tr key={i} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{buyer.name}</td>
                        <td className="px-6 py-4 text-gray-600">{buyer.id}</td>
                        <td className="px-6 py-4 text-gray-600">{buyer.dept}</td>
                        <td className="px-6 py-4 text-gray-600">{buyer.joinDate}</td>
                        <td className="px-6 py-4">
                          <span className={getStatusBadge(buyer.status)}>{buyer.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemove('buyer', buyer.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                          >
                            <FaTrash /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sellers Section */}
        {activeSection === 'sellers' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaStore /> Sellers Management
              </h1>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 p-6">
              <h2 className="text-xl text-purple-900 font-bold mb-4">Registered Sellers</h2>
              
              <div className="relative mb-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Sellers by name or ID"
                  value={sellerSearch}
                  onChange={(e) => setSellerSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-white/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-purple-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Student ID</th>
                      <th className="px-6 py-4 text-left font-semibold">Department</th>
                      <th className="px-6 py-4 text-left font-semibold">Items Listed</th>
                      <th className="px-6 py-4 text-left font-semibold">Items Sold</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredSellers.map((seller, i) => (
                      <tr key={i} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{seller.name}</td>
                        <td className="px-6 py-4 text-gray-600">{seller.id}</td>
                        <td className="px-6 py-4 text-gray-600">{seller.dept}</td>
                        <td className="px-6 py-4 text-gray-600">{seller.listed}</td>
                        <td className="px-6 py-4 text-gray-600">{seller.sold}</td>
                        <td className="px-6 py-4">
                          <span className={getStatusBadge(seller.status)}>{seller.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemove('seller', seller.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                          >
                            <FaTrash /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaBox /> Products Management
              </h1>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 p-6">
              <h2 className="text-xl text-purple-900 font-bold mb-4">All Listed Products</h2>
              
              <div className="relative mb-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Products by name or category"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-white/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-purple-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Product Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Category</th>
                      <th className="px-6 py-4 text-left font-semibold">Price (BDT)</th>
                      <th className="px-6 py-4 text-left font-semibold">Seller</th>
                      <th className="px-6 py-4 text-left font-semibold">Posted Date</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredProducts.map((product, i) => (
                      <tr key={i} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-gray-600 font-semibold">{product.price}</td>
                        <td className="px-6 py-4 text-gray-600">{product.seller}</td>
                        <td className="px-6 py-4 text-gray-600">{product.date}</td>
                        <td className="px-6 py-4">
                          <span className={getStatusBadge(product.status)}>{product.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemove('product', i)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                          >
                            <FaTrash /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sold Items Section */}
        {activeSection === 'sold' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaCheckCircle /> Sold Items History
              </h1>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl text-purple-900 font-bold mb-4">All Sold Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Product</th>
                      <th className="px-6 py-4 text-left font-semibold">Price (BDT)</th>
                      <th className="px-6 py-4 text-left font-semibold">Seller</th>
                      <th className="px-6 py-4 text-left font-semibold">Buyer</th>
                      <th className="px-6 py-4 text-left font-semibold">Sale Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {allSoldItems.map((item, i) => (
                      <tr key={i} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{item.product}</td>
                        <td className="px-6 py-4 text-gray-600 font-semibold">{item.price}</td>
                        <td className="px-6 py-4 text-gray-600">{item.seller}</td>
                        <td className="px-6 py-4 text-gray-600">{item.buyer}</td>
                        <td className="px-6 py-4 text-gray-600">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaEnvelope /> Messages & Support
              </h1>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 p-6">
              <h2 className="text-xl text-purple-900 font-bold mb-4">User Messages</h2>
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className="p-5 bg-gradient-to-r from-purple-100 to-blue-100 border-l-4 border-purple-600 rounded-xl hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <FaEnvelope className="text-purple-600" />
                      <p className="font-semibold text-gray-800">{msg.user}</p>
                    </div>
                    <p className="text-sm text-gray-700 ml-7">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-2 ml-7">{msg.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}