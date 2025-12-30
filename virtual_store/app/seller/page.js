"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000/api";

export default function SellerDashboardPage() {
  const [products, setProducts] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Unified data loader for Products and Messages
  const loadDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);

      // 1. Fetch Seller's specific products
      const prodRes = await fetch(`${API_BASE_URL}/products/my-products`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      // 2. Fetch Messages to calculate unique buyer conversations
      const msgRes = await fetch(`${API_BASE_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        const productList = Array.isArray(prodData) ? prodData : prodData.products || [];
        setProducts(productList);
      }

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        
        // Grouping logic to find unique conversations (mirrors your SellerMessages logic)
        const conversationMap = new Map();
        
        msgData.forEach((message) => {
          // Identify the other user in the conversation
          // In your Prisma setup, this is the buyer interacting with the seller
          const otherUserId = message.senderId; 
          if (otherUserId) {
            conversationMap.set(otherUserId, true);
          }
        });
        
        setChatCount(conversationMap.size);
      }
    } catch (err) {
      console.error("Dashboard Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data every 30 seconds to keep stats updated
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Derived Stats
  const totalProducts = products.length;
  const soldCount = products.filter(p => p.status === 'Sold').length;
  const featuredCount = products.filter(p => p.featured === true).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Seller Dashboard</h1>
        <p style={styles.headerSubtitle}>
          Real-time performance tracking for your shop
        </p>
      </header>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.stat1 }}>
          <div style={styles.statIcon}>📦</div>
          <div>
            <p style={styles.statLabel}>Your Products</p>
            <h2 style={styles.statValue}>{totalProducts}</h2>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.stat2 }}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <p style={styles.statLabel}>Items Sold</p>
            <h2 style={styles.statValue}>{soldCount}</h2>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.stat3 }}>
          <div style={styles.statIcon}>💬</div>
          <div>
            <p style={styles.statLabel}>Active Chats</p>
            <h2 style={styles.statValue}>{chatCount}</h2>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.stat4 }}>
          <div style={styles.statIcon}>⭐</div>
          <div>
            <p style={styles.statLabel}>Featured</p>
            <h2 style={styles.statValue}>{featuredCount}</h2>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={styles.tableCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={styles.tableTitle}>Recent Activity</h2>
            <button 
                onClick={loadDashboardData} 
                style={styles.refreshBtn}
            >
                Refresh Activity
            </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product Details</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && products.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading dashboard...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No products found in your inventory.</td></tr>
                ) : (
                  products.map((p, i) => (
                    <tr key={p.id || i} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{p.productName || "Unnamed Item"}</div>
                        {/* Fix: Wrap ID in String() to prevent substring errors on Numbers */}
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          REF: #{p.id ? String(p.id).substring(0, 8) : i}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            backgroundColor:
                              p.status === "Sold" ? "#ef4444" : "#10b981",
                          }}
                        >
                          {p.status || "Live"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontWeight: 800, color: '#033c8c' }}>
                          ৳{p.price ? Number(p.price).toLocaleString('en-IN') : '0'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  header: { marginBottom: "32px" },
  headerTitle: { fontSize: "32px", fontWeight: 700, color: "#033c8c", marginBottom: "8px" },
  headerSubtitle: { fontSize: "16px", color: "#64748b" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  statCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  stat1: { borderLeft: "4px solid #c9fba8" },
  stat2: { borderLeft: "4px solid #e0cff6" },
  stat3: { borderLeft: "4px solid #d0f5cd" },
  stat4: { borderLeft: "4px solid #e7d4f7" },
  statIcon: { fontSize: "36px" },
  statLabel: { fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 },
  statValue: { fontSize: "30px", fontWeight: 700, color: "#033c8c" },
  tableCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  tableTitle: { fontSize: "20px", fontWeight: 700, color: "#033c8c" },
  refreshBtn: { 
    fontSize: '12px', 
    color: '#033c8c', 
    cursor: 'pointer', 
    background: 'none', 
    border: '1px solid #033c8c', 
    padding: '6px 12px', 
    borderRadius: '8px', 
    fontWeight: 600,
    transition: 'all 0.2s'
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "16px 12px", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #e2e8f0" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "16px 12px", fontSize: "14px", color: "#334155" },
  status: { padding: "4px 10px", borderRadius: "12px", color: "#fff", fontSize: "10px", fontWeight: 800, textTransform: "uppercase" },
};