"use client";

import { useState, useEffect } from "react";

export default function SellerDashboardPage() {
  const [products, setProducts] = useState([]);
  const [featuredCount, setFeaturedCount] = useState(0);

  const loadProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/api/products", {  // ✅ Changed
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data || []);
      setFeaturedCount((data || []).filter((p) => p.featured).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/products/${id}`, {  // ✅ Changed
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(data.message);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ... rest of your code stays the same

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Seller Dashboard</h1>
        <p style={styles.headerSubtitle}>
          Manage your products and track your performance
        </p>
      </header>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.stat1 }}>
          <div style={styles.statIcon}>📦</div>
          <div>
            <p style={styles.statLabel}>Total Products</p>
            <h2 style={styles.statValue}>{products.length}</h2>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.stat2 }}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <p style={styles.statLabel}>Products Sold</p>
            <h2 style={styles.statValue}>
              {products.reduce((acc, p) => acc + (p.sold || 0), 0)}
            </h2>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.stat3 }}>
          <div style={styles.statIcon}>💬</div>
          <div>
            <p style={styles.statLabel}>New Messages</p>
            <h2 style={styles.statValue}>
              {products.filter((p) => p.messages?.length > 0).length}
            </h2>
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
        <h2 style={styles.tableTitle}>Recent Activity</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      backgroundColor:
                        p.status === "Sold"
                          ? "#22c55e"
                          : p.status === "Pending"
                          ? "#f59e0b"
                          : "#3b82f6",
                    }}
                  >
                    {p.status || "Pending"}
                  </span>
                </td>
                <td style={styles.td}>{p.dateAdded || "N/A"}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Buyer-style Dashboard Styles ---------- */
const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    marginBottom: "32px",
  },
  headerTitle: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#033c8c",
    marginBottom: "8px",
  },
  headerSubtitle: {
    fontSize: "16px",
    color: "#64748b",
  },

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
  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  statValue: {
    fontSize: "30px",
    fontWeight: 700,
    color: "#033c8c",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  tableTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#033c8c",
    marginBottom: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    color: "#64748b",
    fontSize: "13px",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#1e293b",
  },
  status: {
    padding: "6px 12px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 600,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
